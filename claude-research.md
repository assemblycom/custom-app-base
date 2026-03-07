# Research Findings: Custom App Base Improvement

## Codebase Analysis

### Project Overview

- **Framework**: Next.js 16.1.0 with App Router, TypeScript strict mode
- **Styling**: Tailwind CSS + CSS Modules
- **UI**: @assembly-js/design-system v3.0.1
- **SDK**: @assembly-js/node-sdk v3.19.1
- **Bridge**: @assembly-js/app-bridge for parent frame communication
- **Runtime**: Node.js 24+, Yarn 4.1.0

### Architecture

```
src/
├── app/
│   ├── page.tsx              # Re-exports from (home)/page.tsx
│   ├── (home)/
│   │   ├── page.tsx          # Server component - session init
│   │   └── sections/         # Client components showing UI examples
│   ├── api/
│   │   └── request/
│   │       └── route.ts      # API route for SDK calls
│   ├── providers/
│   │   └── TokenProvider.tsx  # Context for token distribution
│   └── layout.tsx            # Root layout with design system styles
├── bridge/
│   └── hooks.ts              # React hooks for header controls
├── components/               # Reusable client components
├── utils/
│   ├── session.ts            # Server-only SDK init & session logic
│   └── need.ts               # Error helper for required values
└── declarations.d.ts         # Global type definitions
```

### Server/Client Separation

- Server components handle session initialization and SDK calls
- Client components fetch from API routes, never SDK directly
- API key stays server-side; only session token reaches client

### Session & Token Handling

1. Assembly passes `token` query param when loading iframe
2. Token extracted in server component from `searchParams`
3. `getSession()` decodes token via `assembly.getTokenPayload()`
4. Token payload contains: `clientId`, `companyId`, `internalUserId`, `workspaceId`, `notificationId`, `baseUrl`, `tokenId`
5. Parent frame auto-refreshes tokens and pushes updates via bridge

### Three User Context Modes

| Mode | Token Contains | Expected UX |
|------|---------------|-------------|
| Internal user overview | `internalUserId` only | Admin/overview across all clients and companies |
| Client view | `clientId` (+ `companyId`) | Focused on client's own data |
| Internal user detail view | `internalUserId` + (`clientId` or `companyId`) | Internal user drilling into specific client/company |

**Current state**: The app detects user type but renders identical views for all modes.

### Current SDK Usage

**In `utils/session.ts`:**
- `assembly.retrieveWorkspace()`, `assembly.retrieveClient()`, `assembly.retrieveCompany()`, `assembly.retrieveInternalUser()`, `assembly.getTokenPayload()`

**In `app/api/request/route.ts`:**
- `assembly.listClients()`, `assembly.retrieveClient()`, `assembly.listCompanies()`, `assembly.retrieveCompany()`

**Missing**: No mutations demonstrated (create, update, delete). No client/company picker UI. No realistic workflow patterns.

### App Bridge Hooks

Located in `/bridge/hooks.ts`:
- `useBridgeConfig(portalUrl)` - Configure allowed origins (call early)
- `useBreadcrumbs(breadcrumbs[])` - Set navigation breadcrumbs
- `usePrimaryCta(config | null)` - Set primary header button
- `useSecondaryCta(config | null)` - Set secondary header button
- `useActionsMenu(actions[])` - Set dropdown menu actions

All hooks auto-clear on unmount. Uses `useRef` for callback stability.

### Available SDK Resources (Full List)

| Resource | Operations |
|---|---|
| **Clients** | create, list, retrieve, update, delete |
| **Companies** | create, list, retrieve, update, delete |
| **Notes** | create, list, retrieve, update, delete |
| **Tasks** | create, list (retrieveTasks), retrieve, update, delete |
| **Task Templates** | list, retrieve |
| **Files** | create, list, retrieve, delete, download |
| **File Channels** | create, list, retrieve |
| **Messages** | send, list |
| **Message Channels** | create, list, retrieve |
| **Notifications** | create, list, delete, markRead, markUnread |
| **Invoices** | create, list, retrieve |
| **Invoice Templates** | list |
| **Forms** | list, retrieve, requestFormResponse, listFormResponses |
| **Contracts** | send, list, retrieve |
| **Contract Templates** | list, retrieve |
| **Products** | list, retrieve |
| **Prices** | list, retrieve |
| **Subscriptions** | create, list, retrieve, cancel |
| **Subscription Templates** | list |
| **Internal Users** | list, retrieve |
| **Custom Fields** | list, listOptions |
| **Workspace** | retrieve |
| **App Installs** | list, retrieve |
| **App Connections** | list, create |
| **Payments** | list |

### SDK Call Patterns

**Listing with pagination** (cursor-based):
```typescript
const clients = await assembly.listClients({ limit: 20, nextToken: cursor });
```

**Filtering**:
- `listClients`: `companyId`, `email`, `givenName`, `familyName`
- `listNotes`: `entityType`, `entityId`
- `listTasks`: `createdBy`, `parentTaskId`, `status`, `clientId`, `internalUserId`, `companyId`

**Retrieve by ID**:
```typescript
const client = await assembly.retrieveClient({ id: 'client-id' });
```

**Creation (mutations)**:
```typescript
const note = await assembly.createNote({
  requestBody: { content: '...', entityId: '...', entityType: '...' }
});
```

**Important**: All SDK response properties are optional (OpenAPI codegen). Must use type guards when assigning values.

### Design System Components Used

- **Typography**: `Heading`, `Body` (sizes: sm, base, lg, xl, 2xl, 3xl)
- **Actions**: `Button`, `IconButton` (variants: primary, secondary, text)
- **Icons**: `Icon` component with named icons (Plus, Check, Close, Settings, etc.)
- Additional available: @radix-ui primitives (20+), embla-carousel, react-hook-form, sonner toasts, next-themes

### Current Home Page Sections

1. **Header** - Welcome message with ASCII art
2. **Resources** - Links to docs
3. **Session Context** - User/workspace info display
4. **Request Tester** - Interactive SDK operation tester
5. **Header Controls** - Bridge hook demonstration
6. **Design Showcase** - Component gallery

### Conditional Rendering

- No API Key -> `MissingApiKey.tsx` (setup guide)
- No Token -> `GettingStarted.tsx` (dev mode link)
- Has Token -> Full app sections (identical for all user types)

### Current AGENTS.md

Identical to CLAUDE.md. Contains SDK init patterns, architecture guidance, and design system docs. Needs custom development guidance for building real apps.

---

## Iframe-Embedded App Patterns

### Communication Best Practices

- **Typed message protocol**: Define explicit message type unions for type safety across iframe boundary
- **Callback registration**: Register JS functions with unique IDs, send IDs over postMessage (functions can't be serialized)
- **Origin allowlisting**: Validate parent origin via `document.referrer`, maintain allowlist of trusted origins
- **React hooks abstraction**: Use `useRef` for callback stability, `useEffect` for cleanup, module-level flags for one-time config

### Security Considerations

- `next.config.js` sets `X-Frame-Options` to empty string (required for iframe embedding)
- `X-Content-Type-Options: nosniff` and XSS protection enabled
- Origin validation on all postMessage communication
- API key never exposed to client bundle
- Consider adding `Content-Security-Policy: frame-ancestors` for more modern security

### Navigation Patterns

- **Breadcrumbs**: Controlled via bridge, rendered in parent header
- **Parent navigation**: `AssemblyBridge.navigate(route, options?)` for predefined routes (apps, billing, contracts, files, forms, helpdesk, invoices, messages, notifications, settings, products)
- **Header CTAs/Actions**: Use bridge hooks for native-feeling header integration
- Clear all header state on component unmount

### Layout Recommendations

- Design for parent-allocated width, not fixed viewport
- Use fluid layouts with relative units
- Parent controls page chrome; app fills content area
- Tailwind responsive utilities work well within iframe constraints

---

## Testing Context

No test framework, test files, or testing utilities were found in the codebase. Testing infrastructure will need to be established as part of the improvement work.

### Recommendations

- **Framework**: Vitest (fast, TypeScript-native, compatible with Next.js)
- **Component testing**: @testing-library/react
- **API route testing**: Supertest or direct handler invocation
- **E2E** (optional): Playwright for iframe-embedded testing scenarios
