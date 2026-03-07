Now I have enough context. Let me produce the section content.

# Section 10: AGENTS.md Rewrite

## Overview

This section rewrites the `/Users/neil/code/custom-apps/custom-app-base/AGENTS.md` file to reflect the updated app architecture. The new AGENTS.md must be concise (under 150 lines), structured around six sections, and reference actual app files rather than standalone code snippets.

This section has no dependencies on other sections and can be implemented at any time. However, its content should reflect the final state of the app after all other sections are complete (the new view routing, API routes, SWR hooks, bridge patterns, and design system usage).

## Verification Criteria

There are no automated tests for this section. The implementer should manually verify:

- AGENTS.md is under 150 lines total
- All six required sections are present: App Context, View Patterns, SDK Patterns, API Route Patterns, Bridge Patterns, Design System
- Code examples reference actual app files (e.g., `utils/session.ts`, `hooks/useApi.ts`, `app/api/notes/route.ts`) rather than standalone snippets
- The file replaces the existing AGENTS.md content entirely

## File to Modify

**`/Users/neil/code/custom-apps/custom-app-base/AGENTS.md`** -- full replacement of the existing file.

## Content Structure

The rewritten AGENTS.md should contain the following six sections, each kept to roughly 5-10 lines of prose with one short code example where helpful. The total file should be under 150 lines.

### 1. App Context

Briefly describe:
- The app is a Next.js iframe embedded in Assembly's dashboard (internal users) and client portal (clients)
- A `token` query parameter identifies user, workspace, and context
- The API key must stay server-side (server components and API routes only)
- Reference `utils/session.ts` for session initialization and `app/page.tsx` for the entry point

### 2. View Patterns

Explain the three view types and how routing works:
- `internal-overview`: internal user with no client/company context, renders `InternalOverview`
- `internal-detail`: internal user with client/company context (token-driven or in-app navigation), renders `DetailView`
- `client`: client user from the portal, renders `ClientView`
- The `ViewType` is determined in `utils/session.ts` based on which IDs are present in the token payload
- `app/page.tsx` server component routes to the correct view based on `viewType`
- In-app navigation to detail uses `app/detail/page.tsx` with query params
- Reference `utils/types.ts` for the `ViewType` and `SessionData` types

### 3. SDK Patterns

Cover the essential SDK usage rules:
- SDK is generated from the OpenAPI spec; always verify method signatures and parameter shapes from type definitions before use
- Initialize with `assemblyApi({ apiKey, token })` -- see `utils/session.ts`
- All SDK response properties are optional by default; use type guard filters before rendering or assigning
- Pagination uses `limit` and `nextToken` parameters
- Mutations use `requestBody` in the parameter object
- Include a short example showing a type guard filter pattern (2-3 lines)

### 4. API Route Patterns

Describe the API route conventions used across the app:
- Token is passed via `Authorization: Bearer <token>` header (not query params)
- Routes extract token from the authorization header, init SDK, execute operation, return JSON
- Error responses use a consistent `{ error: string }` shape with appropriate HTTP status codes
- Mutation routes validate request bodies with zod schemas
- Reference `app/api/notes/route.ts` as a complete example showing GET/POST/PUT/DELETE
- Reference `utils/types.ts` for the `ApiError` type

### 5. Bridge Patterns

Explain the app-bridge integration:
- Bridge must be configured before use with `useBridgeConfig(portalUrl)` -- see `bridge/hooks.ts`
- `useBreadcrumbs` sets navigation trail; first item can have `onClick` for back navigation
- `usePrimaryCta` and `useSecondaryCta` set header action buttons (auto-cleared on unmount)
- `useActionsMenu` sets the dropdown actions menu
- Detail views update breadcrumbs to include a back-navigable app name plus entity name
- Client views use simple breadcrumbs with just the app name
- Include a short example showing breadcrumb setup with back navigation (2-3 lines)

### 6. Design System

State the design system rules:
- Import all UI components from `@assembly-js/design-system` -- never use native HTML elements with Tailwind for buttons, headings, text, inputs, etc.
- Verify props in [Storybook](https://design-system.assembly.com/) before use; do not make up props or assume HTML attributes are spread
- Key components: `Button`, `Heading`, `Body`, `Icon`, `Badge`, `Tabs`, `Input`, `TextArea`, `Select`, `Dialog`, `Sheet`, `Table`, `Skeleton`, `Avatar`, `Tooltip`
- Reference `components/shared/EmptyState.tsx` and `components/resources/NoteForm.tsx` as examples of design system component usage
- Loading states use `Skeleton` components matching the shape of expected content

## Additional Guidance

The following rules from the existing AGENTS.md should be preserved in appropriate sections:

- **TypeScript rules**: Import types from source modules, define stores/contexts before consuming components, verify prop signatures, export constants needed by other files. These fit naturally into the SDK Patterns or a brief TypeScript note at the top.
- **Links**: Keep the documentation links to [Custom Apps Guide](https://docs.assembly.com/docs/custom-apps-overview) and [API Reference](https://docs.assembly.com/reference/getting-started-introduction) at the bottom of the file.

The current AGENTS.md is 104 lines. The rewrite should be more information-dense with less boilerplate, targeting under 150 lines while covering all six sections and the new app architecture.