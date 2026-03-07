# Specification: Custom App Base Improvement

## Goal

Transform the custom-app-base from a getting-started guide into a realistic, functional example app that demonstrates real-world patterns for building Assembly platform custom apps. Also improve AGENTS.md to provide concise development guidance.

## Current State

The app is a Next.js 16 app running as an iframe in the Assembly dashboard/client portal. It currently:
- Shows identical views for all user types
- Demonstrates SDK reads (list/retrieve clients and companies) via a request tester UI
- Has interactive demos for app-bridge header controls
- Shows design system component examples
- Properly handles session tokens and server-side API key protection

## Target State

### Three Distinct Views

**1. Internal User Overview** (token has `internalUserId`, no `clientId`/`companyId`)
- Filterable list of clients and companies
- Click a client/company to navigate to detail view within the app
- App-bridge breadcrumbs show: `App Name`
- Demonstrates: `listClients`, `listCompanies` with pagination and filtering

**2. Internal User Detail View** (token has `internalUserId` + `clientId` or `companyId`)
- Shows when internal user views a specific client/company from the Assembly dashboard
- Also used when navigating within the app from the overview list
- Displays client/company profile info
- Shows related resources: notes, tasks, files
- Supports mutations: create/edit/delete notes, create/update tasks, upload files
- App-bridge breadcrumbs show: `App Name > Client Name` (or `Company Name`)

**3. Client View** (token has `clientId`, no `internalUserId`)
- Client sees their own profile and company info
- Browse their notes, tasks, and files
- Limited mutations appropriate for clients
- App-bridge breadcrumbs show: `App Name`

### URL Architecture

Assembly provides two URL fields during app setup:
- **Internal URL**: Loaded in the dashboard for internal users
- **Client URL**: Loaded in the client portal for clients

Both receive a `token` query parameter. The token determines the viewing context - no path-based user identification needed.

For in-app navigation (internal user clicking a client in the list), use Next.js client-side routing with query params or path segments, updating bridge breadcrumbs accordingly.

### SDK Mutations to Demonstrate

1. **Notes** (full CRUD): Create, read, update, delete notes attached to clients/companies
2. **Tasks** (create + status workflow): Create tasks, update status - demonstrates workflow patterns
3. **Files** (create + list): Upload files, list files - demonstrates file handling

### Data Fetching Pattern

- Use SWR (already in dependencies) for client-side data fetching with stale-while-revalidate
- Server components for initial page load data
- API routes as proxy for all SDK calls from client components

### Existing Content

Move current demo sections (request tester, header controls, design showcase, getting started) to a dedicated `/examples` page. The main app should feel like a real application.

### AGENTS.md Improvements

Rewrite AGENTS.md to provide concise guidance on:
- View architecture patterns (internal vs client vs detail views)
- SDK usage patterns (CRUD operations, type guards, error handling)
- App-bridge integration patterns (breadcrumbs, CTAs, navigation)
- Keep it brief - short descriptions, minimal code snippets

## Technical Constraints

- API key must remain server-side (API routes or server components)
- All SDK response properties are optional (OpenAPI codegen) - use type guards
- App-bridge must be configured early with portal URL before sending messages
- Token-based context determines view, not URL paths
- Use @assembly-js/design-system components for all UI
- Don't assume design system props - verify before use
- Cursor-based pagination (`nextToken`) for all list endpoints

## Key SDK Methods Needed

**Reads:**
- `listClients({ limit, nextToken, companyId })`
- `listCompanies({ limit, nextToken })`
- `retrieveClient({ id })`, `retrieveCompany({ id })`
- `listNotes({ entityType, entityId })`
- `retrieveTasks({ clientId, companyId, status })`
- `listFiles({ })`

**Mutations:**
- `createNote({ requestBody: { content, entityId, entityType } })`
- `updateNote({ id, requestBody: { content } })`
- `deleteNote({ id })`
- `createTask({ requestBody: { ... } })`
- `updateTask({ id, requestBody: { status } })`
- `createFile({ requestBody: { ... } })`

**Note:** Verify exact parameter signatures from SDK types before implementation.

## Out of Scope

- Authentication/login flows (handled by Assembly platform)
- Multi-tenant data isolation (handled by token scoping)
- Production error tracking/monitoring
- Automated testing setup (separate concern)
