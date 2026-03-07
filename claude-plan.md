# Implementation Plan: Custom App Base Improvement

## Overview

This plan transforms the Assembly custom-app-base from a getting-started guide into a realistic example app. The current app shows identical views for all user types and uses demo-style UI sections (request tester, design showcase). The improved app will have distinct views for internal users, clients, and detail contexts, demonstrate real SDK mutations (notes, tasks, files), showcase the `@assembly-js/design-system` component library throughout the UI, and provide concise developer guidance via an improved AGENTS.md.

The app is a Next.js 16 application running as an iframe embedded in the Assembly dashboard (for internal users) and client portal (for clients). It communicates with the parent frame via `@assembly-js/app-bridge` for header controls (breadcrumbs, CTAs, actions menu). A session token passed as a `?token` query parameter identifies the user, workspace, and context.

## Architecture

### View Routing Strategy

The Assembly platform provides two URL fields during app setup: an internal URL and a client URL. Both receive a `token` query parameter. The token payload determines the viewing context:

| Token Contains | View | Route |
|---|---|---|
| `internalUserId` only | Internal Overview | `/` (home) |
| `internalUserId` + `clientId` or `companyId` | Detail View | `/` (token-driven) |
| `clientId` (no `internalUserId`) | Client View | `/` (token-driven) |

The home page server component decodes the token and renders the appropriate view. For in-app navigation (internal user clicking a client in the overview list), use Next.js client-side routing to a `/detail` route with query params, updating bridge breadcrumbs accordingly.

### Target Directory Structure

```
src/
├── app/
│   ├── page.tsx                    # Server component - session init, view routing
│   ├── detail/
│   │   └── page.tsx                # Detail view for in-app navigation
│   ├── examples/
│   │   └── page.tsx                # Moved existing demo content
│   ├── api/
│   │   ├── clients/
│   │   │   └── route.ts            # List/retrieve clients
│   │   ├── companies/
│   │   │   └── route.ts            # List/retrieve companies
│   │   ├── notes/
│   │   │   └── route.ts            # CRUD notes
│   │   ├── tasks/
│   │   │   └── route.ts            # CRUD tasks
│   │   ├── files/
│   │   │   └── route.ts            # Upload/list files
│   │   └── request/
│   │       └── route.ts            # Keep existing for examples page
│   ├── providers/
│   │   └── TokenProvider.tsx        # Existing - no changes
│   └── layout.tsx                   # Existing - no changes
├── bridge/
│   └── hooks.ts                     # Existing - no changes
├── components/
│   ├── views/
│   │   ├── InternalOverview.tsx     # Client/company list with picker
│   │   ├── DetailView.tsx           # Client/company detail with resources
│   │   └── ClientView.tsx           # Client-facing view
│   ├── resources/
│   │   ├── NotesList.tsx            # Notes list with create/edit/delete
│   │   ├── NoteForm.tsx             # Create/edit note form
│   │   ├── TasksList.tsx            # Tasks list with status management
│   │   ├── TaskForm.tsx             # Create task form
│   │   └── FilesList.tsx            # Files list with upload
│   ├── shared/
│   │   ├── EntityPicker.tsx         # Client/company search and select
│   │   ├── ResourceTabs.tsx         # Tabbed interface for notes/tasks/files
│   │   ├── Pagination.tsx           # Cursor-based pagination controls
│   │   └── EmptyState.tsx           # Empty state placeholder
│   └── ... (existing components)
├── hooks/
│   └── useApi.ts                    # SWR-based data fetching hook
└── utils/
    ├── session.ts                   # Existing - extend with view type detection
    ├── need.ts                      # Existing - no changes
    └── types.ts                     # Shared TypeScript types
```

### Data Flow

```
Token (query param)
  → Server component decodes token (getSession)
  → Determines view type (internal overview / detail / client)
  → Passes session data + token to appropriate client view component
  → Client components use SWR + API routes for data fetching/mutations
  → API routes initialize SDK with token, execute operations, return JSON
```

## Design System Usage

All UI components should use `@assembly-js/design-system` components instead of native HTML elements with Tailwind. The design system Storybook at https://design-system.assembly.com/ is the reference for available components, their props, and usage patterns. Key components to use throughout the app:

- **`Button`** - All buttons (primary actions, secondary actions, destructive actions). Never use native `<button>` with Tailwind.
- **`Heading`** - All headings (page titles, section headers, entity names)
- **`Body`** - All body text (descriptions, labels, metadata). Supports size and weight variants.
- **`Icon`** - All icons. Check Storybook for available icon names.
- **`Badge`** - Status indicators (task status, entity type labels)
- **`Card`** / layout components - Content containers instead of raw `<div>` with border styles
- **`Tabs`** - Tabbed interfaces (resource tabs, entity type tabs). Use design system Tabs instead of building custom tab UI.
- **`Input`** / **`TextArea`** / **`Select`** - Form controls instead of native inputs
- **`Dialog`** / **`Sheet`** - Modals and slide-overs for forms (note creation, task creation)
- **`Table`** - Structured data display (file lists, task lists)
- **`Avatar`** - User/entity avatars
- **`Tooltip`** - Action button tooltips
- **`Skeleton`** - Loading state placeholders

Before using any component, verify its props in the Storybook. Do NOT make up props -- use only what the design system provides. Do NOT assume HTML attributes will be spread to the underlying DOM element.

This is a key goal of the example app: demonstrating how to build a realistic custom app using the Assembly design system rather than ad-hoc Tailwind styling.

## Section 1: Session & View Type Detection

### Extend `utils/session.ts`

Add a `viewType` field to the session data that explicitly categorizes the viewing context:

```typescript
type ViewType = 'internal-overview' | 'internal-detail' | 'client';
```

Logic:
- If `internalUserId` present AND no `clientId`/`companyId` → `internal-overview`
- If `internalUserId` present AND (`clientId` or `companyId`) → `internal-detail`
- If `clientId` present AND no `internalUserId` → `client`

The existing `getSession()` function already fetches user/client/company data conditionally. Extend it to include `viewType` in its return value.

### Update Home Page (`app/page.tsx`)

The server component already initializes session. After determining `viewType`, render the corresponding view component, passing down session data and token.

## Section 2: API Routes

Create dedicated API routes for each resource type. Each route:
1. Extracts `token` from the `Authorization: Bearer <token>` header
2. Initializes SDK with API key + token
3. Validates input (zod schemas for mutation request bodies)
4. Executes the SDK operation
5. Returns JSON response

### Token Passing Convention

All client-side requests pass the token via `Authorization: Bearer <token>` header (not query params). The `useApi` hook centralizes this. API routes read from `request.headers.get('authorization')`.

### Error Handling Pattern

Every route wraps SDK calls in try/catch and returns structured error responses:

```typescript
// On success: return Response.json(data)
// On error: return Response.json({ error: message }, { status: code })
```

Map SDK errors to appropriate HTTP status codes (400 for validation, 401 for auth, 404 for not found, 500 for unexpected). Define an `ApiError` type in `utils/types.ts` for consistent error shape across routes.

### Input Validation

Mutation routes (POST/PUT/DELETE) validate request bodies using zod schemas before passing to the SDK. This catches malformed input early and provides clear error messages. Read-only routes validate query param types (e.g., `limit` is a number).

### `/api/clients/route.ts`

- **GET**: `listClients` with optional `companyId`, `limit`, `nextToken` query params
- Returns paginated client list

### `/api/companies/route.ts`

- **GET**: `listCompanies` with optional `limit`, `nextToken` query params
- Returns paginated company list

### `/api/notes/route.ts`

- **GET**: `listNotes` with `entityType`, `entityId` query params
- **POST**: `createNote` with `{ content, entityId, entityType }` body
- **PUT**: `updateNote` with `{ id, content }` body
- **DELETE**: `deleteNote` with `id` query param

### `/api/tasks/route.ts`

- **GET**: `retrieveTasks` with optional `clientId`, `companyId`, `status` query params
- **POST**: `createTask` with task data in body
- **PUT**: `updateTask` with `{ id, status, ... }` body
- **DELETE**: `deleteTask` with `id` query param

### `/api/files/route.ts`

- **GET**: `listFiles` with optional query params
- **POST**: `createFile` with file data in body

**Important**: Before implementing each route, verify the exact SDK method signatures and parameter objects from the SDK type definitions. All parameters are passed via parameter objects, and some endpoints expect `requestBody` while others use inline params.

## Section 3: SWR Data Fetching Hook

Create a `useApi` hook that wraps SWR for consistent data fetching from API routes.

```typescript
function useApi<T>(endpoint: string, params?: Record<string, string>): {
  data: T | undefined;
  error: Error | undefined;
  isLoading: boolean;
  mutate: () => void;
}
```

The hook:
- Constructs the URL with params as query parameters
- Passes token via `Authorization: Bearer <token>` header on every request
- Uses SWR with sensible defaults (revalidate on focus, dedupe interval)
- Token comes from the TokenProvider context
- Returns data, error state, loading state, and a mutate function for cache invalidation after mutations

### `useApiMutation` Hook

```typescript
function useApiMutation(endpoint: string): {
  trigger: (method: 'POST' | 'PUT' | 'DELETE', body?: unknown) => Promise<unknown>;
  isMutating: boolean;
  error: Error | undefined;
}
```

The mutation hook:
- Sends requests with `Authorization: Bearer <token>` header and JSON body
- Tracks in-flight state via `isMutating` (use to disable buttons during mutations)
- On success, calls `mutate()` on the related SWR cache key to revalidate
- On error, parses the structured `ApiError` response and surfaces it
- Integrates with `react-hook-form` via the `onSubmit` handler calling `trigger`

Consider using SWR's `useSWRMutation` as the underlying implementation, which provides `isMutating` state out of the box.

## Section 4: Internal Overview View

### `InternalOverview.tsx`

This is the main view when an internal user opens the app without a specific client/company context.

**Layout:**
- Search/filter bar at top
- Tabbed interface: "Clients" | "Companies"
- Scrollable list of entities with key info (name, email, company for clients; name for companies)
- Cursor-based pagination at bottom
- Click an entity to navigate to detail view

**Data fetching:**
- Use `useApi` to fetch from `/api/clients` and `/api/companies`
- Support `limit` param for page size
- Support `nextToken` for pagination

**Navigation on click:**
- Use Next.js `router.push('/detail?clientId=xxx&token=yyy')` or similar
- Update bridge breadcrumbs via `useBreadcrumbs`

**Bridge integration:**
- Breadcrumbs: `[{ label: "App Name" }]`
- No CTAs or actions menu on overview (those belong on detail views)

### `EntityPicker.tsx`

Reusable search/select component used in the overview list. Renders each entity as a clickable row using design system components (`Body` for names, `Avatar` for entity icons). Could also be used in forms that need to select a client/company. Use design system `Input` for search filtering.

### `Pagination.tsx`

Cursor-based pagination component. Uses design system `Button` for navigation controls. Shows "Next" button when `nextToken` is present in API response. Maintains pagination state and passes `nextToken` to the data fetching hook.

## Section 5: Detail View

### `DetailView.tsx`

Shown when:
1. Token has `internalUserId` + `clientId`/`companyId` (platform-driven)
2. Internal user navigates from overview list (in-app routing)

**Layout:**
- Entity header: name, key info, avatar/logo
- Tabbed resource browser: "Notes" | "Tasks" | "Files"
- Each tab shows the relevant resource list with create/manage capabilities

**Data sources:**
- Entity info from session (if token-driven) or fetched via API (if in-app navigation)
- Notes, tasks, files fetched via respective API routes filtered by entity

**Bridge integration:**
- Breadcrumbs: `[{ label: "App Name", onClick: navigateToOverview }, { label: entityName }]`
- Primary CTA: "Add Note" or "Add Task" (context-dependent on active tab)
- Actions menu: Additional actions relevant to active tab

### Detail Route (`app/detail/page.tsx`)

Server component for in-app navigation to detail views. Extracts `clientId` or `companyId` from query params, along with `token`. Fetches entity data server-side and renders `DetailView`.

For token-driven detail views (internal user viewing from dashboard), the home page server component handles this directly since the token already contains the entity context.

## Section 6: Resource Components

### `NotesList.tsx`

- Fetches notes via `useApi('/api/notes', { entityType, entityId })`
- Renders list of notes with content preview, timestamp, author
- Each note has edit/delete actions (inline buttons or dropdown)
- "Add Note" triggers `NoteForm` (inline or modal)
- After create/edit/delete, call SWR mutate to refresh list

### `NoteForm.tsx`

- Simple form with design system `TextArea` for content, `Button` for submit/cancel
- Rendered inside a `Dialog` or `Sheet` component for create/edit flows
- Handles both create and edit modes (receives optional existing note)
- On submit, POST or PUT to `/api/notes`
- Uses `react-hook-form` for form state (already in dependencies)

### `TasksList.tsx`

- Fetches tasks via `useApi('/api/tasks', { clientId or companyId })`
- Renders tasks using design system `Table` or structured list with `Body` and `Badge` for status
- Status `Badge` uses color variants (e.g., green for complete, yellow for in-progress)
- Status can be updated inline via design system `Select` dropdown
- "Add Task" uses design system `Button`; triggers `TaskForm`
- Status update calls PUT to `/api/tasks`

### `TaskForm.tsx`

- Form with design system `Input` (title), `TextArea` (description), `Select` (optional fields)
- Rendered inside a `Dialog` or `Sheet`
- On submit, POST to `/api/tasks`
- Verify exact `createTask` requestBody shape from SDK types before implementation

### `FilesList.tsx`

- Fetches files via `useApi('/api/files', { ... })`
- Renders file list with name, type, size, upload date
- Upload button triggers file input
- On file select, POST to `/api/files`
- File upload is intentionally simplified for this example app (no progress tracking). Basic upload via FormData POST.

### `ResourceTabs.tsx`

Reusable tabbed interface wrapping notes/tasks/files using the design system `Tabs` component. Accepts `entityType` and `entityId` props. Manages active tab state. Updates bridge primary CTA based on active tab.

## Section 7: Client View

### `ClientView.tsx`

Shown when a client user opens the app from the client portal.

**Layout:**
- Client profile header: name, email, company
- Company info section (if company data available)
- Resource browser (same `ResourceTabs` component as detail view)

**Key differences from internal detail view:**
- No navigation breadcrumb trail (client is already in their own context)
- May have fewer actions available (e.g., no delete, limited task management)
- Simpler header - just the app name in breadcrumbs
- Data automatically scoped to client's own resources via token

**Entity context for ResourceTabs:**
- `ClientView` derives `entityType='client'` and `entityId` from `session.client.id`
- These are passed as props to `ResourceTabs`, which forwards them to each resource component
- The token automatically scopes SDK calls to the client's own data

**Data sources:**
- Client and company info from session data (already fetched in server component)
- Notes, tasks, files fetched via API routes (token automatically scopes to client)

**Bridge integration:**
- Breadcrumbs: `[{ label: "App Name" }]`
- Primary CTA: "Add Note" (or context-dependent)

## Section 8: Examples Page

### Move Existing Content to `/examples`

Create `app/examples/page.tsx` as a server component that renders the existing demo sections:
- `RequestTester` - Interactive SDK operation tester
- `HeaderControls` - Bridge hook demonstration
- `DesignShowcase` - Component gallery
- `Resources` - Documentation links
- `GettingStarted` / `MissingApiKey` - Setup guides

The examples page should be accessible via in-app navigation (link from the main app) and directly via URL. It preserves all the educational value of the current home page while keeping the main app realistic.

Move the existing section components from `app/(home)/sections/` to `app/examples/sections/`. Remove the `(home)` route group entirely after migration -- its `page.tsx` is replaced by the new root `page.tsx` with view routing, and its section components live under `app/examples/`.

## Section 9: Shared Utilities & Types

### `utils/types.ts`

Define shared TypeScript types used across components:

```typescript
type ViewType = 'internal-overview' | 'internal-detail' | 'client';

interface SessionData {
  viewType: ViewType;
  workspace: Workspace;
  client?: Client;
  company?: Company;
  internalUser?: InternalUser;
  token: string;
}
```

**Important**: Use `import type` syntax for SDK type imports (Client, Company, etc.) from `@assembly-js/node-sdk` to avoid pulling runtime code into client bundles. Use type guards to narrow optional properties.

### `ApiError` Type

```typescript
interface ApiError {
  error: string;
  status: number;
}
```

Used by API routes for consistent error responses and by client hooks for error handling.

### `EmptyState.tsx`

Simple component for when a resource list has no items. Uses design system `Icon` (contextual icon), `Heading` (message), `Body` (description), and `Button` (action like "Create your first note").

### Loading States

Resource components use SWR's `isLoading` to show loading placeholders via the design system `Skeleton` component. Each resource list component handles its own loading state inline, rendering `Skeleton` elements that match the shape of the expected content.

## Section 10: AGENTS.md Rewrite

Rewrite AGENTS.md to provide concise development guidance. Structure:

1. **App Context** - Brief description of iframe architecture, token-based context
2. **View Patterns** - How to branch UI based on viewType (internal overview, detail, client)
3. **SDK Patterns** - Init, reads with pagination, mutations with requestBody, type guards
4. **API Route Patterns** - Token forwarding, error handling, response format
5. **Bridge Patterns** - Breadcrumbs, CTAs, actions menu, navigation
6. **Design System** - Component imports, don't assume props

Keep each section to 5-10 lines with one short code example where helpful. Total target: under 150 lines. Reference the app's own code as examples rather than writing standalone snippets.

## Implementation Order

1. Session & view type detection (foundation)
2. API routes (data layer)
3. SWR data fetching hook (client data layer)
4. Internal overview view (primary view)
5. Detail view + resource components (core functionality)
6. Client view (reuses resource components)
7. Examples page (move existing content)
8. Shared utilities & empty states (polish)
9. AGENTS.md rewrite (documentation)

Each section builds on the previous. Resource components (notes, tasks, files) are built as part of the detail view section but reused in the client view.

## Edge Cases & Considerations

- **Missing token**: Show the existing GettingStarted component
- **Missing API key**: Show the existing MissingApiKey component
- **Empty lists**: Use EmptyState component with contextual messaging
- **SDK type optionality**: All SDK response properties are optional. Always filter/validate before rendering.
- **Pagination boundaries**: Handle when `nextToken` is absent (last page)
- **File upload errors**: Show toast notification (sonner is in dependencies) on failure
- **Bridge timing**: Configure bridge before sending any messages (BridgeConfigProvider pattern)
- **SWR cache**: Mutate/revalidate after every mutation to keep UI in sync
- **Mutation in-flight state**: Disable mutation buttons while `isMutating` is true to prevent concurrent mutations
