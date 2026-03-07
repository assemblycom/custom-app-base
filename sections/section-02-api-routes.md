Good -- `@/*` maps to the project root. Now I have all the context needed. Let me generate the section content.

# Section 2: API Routes

## Overview

This section creates dedicated Next.js API routes for clients, companies, notes, tasks, and files. Each route extracts the session token from the `Authorization: Bearer <token>` header, initializes the Assembly SDK, validates input, executes SDK operations, and returns structured JSON responses.

**Depends on:** Section 01 (session/viewType detection) -- specifically `utils/types.ts` for the `ApiError` interface. However, the `ApiError` type is simple enough to define inline if Section 09 has not yet been implemented.

**Blocks:** Section 03 (SWR hooks), Section 04 (internal overview), Section 05 (detail view), Section 06 (resource components), Section 07 (client view).

## Files to Create

- `/Users/neil/code/custom-apps/custom-app-base/app/api/clients/route.ts`
- `/Users/neil/code/custom-apps/custom-app-base/app/api/companies/route.ts`
- `/Users/neil/code/custom-apps/custom-app-base/app/api/notes/route.ts`
- `/Users/neil/code/custom-apps/custom-app-base/app/api/tasks/route.ts`
- `/Users/neil/code/custom-apps/custom-app-base/app/api/files/route.ts`

## Files to Create (Tests)

- `/Users/neil/code/custom-apps/custom-app-base/app/api/clients/route.test.ts`
- `/Users/neil/code/custom-apps/custom-app-base/app/api/companies/route.test.ts`
- `/Users/neil/code/custom-apps/custom-app-base/app/api/notes/route.test.ts`
- `/Users/neil/code/custom-apps/custom-app-base/app/api/tasks/route.test.ts`
- `/Users/neil/code/custom-apps/custom-app-base/app/api/files/route.test.ts`

## Background: Token Passing Convention

All client-side requests pass the token via `Authorization: Bearer <token>` header (not query params). The `useApi` hook (Section 03) centralizes this. API routes extract the token from `request.headers.get('authorization')`.

This differs from the existing `/api/request/route.ts` which accepts the token in the JSON body. The new convention is more RESTful and avoids leaking tokens in URLs.

## Background: SDK Initialization

The SDK is initialized using `assemblyApi` from `@assembly-js/node-sdk`. It takes `apiKey` (from `process.env.ASSEMBLY_API_KEY`) and the session `token`. The SDK exposes static-style methods that are bound to the initialized instance. See the existing `/Users/neil/code/custom-apps/custom-app-base/app/api/request/route.ts` for reference.

The `need` utility from `@/utils/need` throws if the API key is missing.

## Background: SDK Method Signatures

Before implementing, be aware of these actual SDK method signatures (verified from `DefaultService.d.ts`):

**Clients:**
- `listClients({ companyId?, email?, givenName?, familyName?, nextToken?, limit? })` -- returns `{ data?: Array<...>, nextToken? }`

**Companies:**
- `listCompanies({ name?, isPlaceholder?, nextToken?, limit? })` -- returns `{ data?: Array<...>, nextToken? }`

**Notes:**
- `listNotes({ entityType?, entityId?, limit?, nextToken? })` -- returns `{ data?: Array<...>, nextToken? }`
- `createNote({ requestBody: { entityType, entityId, title, content? } })` -- `entityType` and `entityId` and `title` are required
- `updateNote({ id, requestBody: { title?, content? } })` -- `id` is required
- `deleteNote({ id })` -- `id` is required

**Tasks:**
- `retrieveTasks({ limit?, nextToken?, createdBy?, parentTaskId?, status?, clientId?, internalUserId?, companyId? })` -- note the method name is `retrieveTasks` not `listTasks`; returns `{ data?: Array<...>, nextToken? }`
- `createTask({ requestBody: { name?, description?, parentTaskId?, status?, internalUserId?, clientId?, companyId?, dueDate?, templateId?, viewers? } })`
- `updateTask({ id, requestBody: { name?, description?, status?, internalUserId?, clientId?, companyId?, dueDate?, isArchived?, viewers? } })`
- `deleteTask({ id })`

**Files:**
- `listFiles({ channelId, path?, nextToken?, limit? })` -- `channelId` is **required**; returns `{ data?: Array<...>, nextToken? }`
- `createFile({ fileType, requestBody: { path, channelId, linkUrl?, clientPermissions? } })` -- `fileType` and `requestBody.path` and `requestBody.channelId` are required
- `listFileChannels({ membershipType?, membershipEntityId?, memberId?, nextToken?, limit?, clientId?, companyId? })` -- used to discover channel IDs

## Tests -- Write First

Testing strategy: Mock the `@assembly-js/node-sdk` module at the top of each test file using `vi.mock`. Create a mock `assemblyApi` that returns an object with the relevant SDK methods as `vi.fn()` stubs. Invoke the route handler directly by constructing a `Request` object and calling the exported `GET`/`POST`/`PUT`/`DELETE` functions.

### Common Test Patterns (apply to all route test files)

```typescript
// Test: Route returns 401 when Authorization header is missing
// Test: Route returns 401 when Authorization header has invalid format
// Test: Route returns 500 with structured ApiError when SDK throws unexpected error
```

Each test file should verify these three patterns in addition to the route-specific tests below.

### `/api/clients/route.test.ts`

```
# Test: GET returns paginated client list
# Test: GET passes companyId filter to SDK when provided
# Test: GET passes limit and nextToken to SDK for pagination
# Test: GET returns empty list when no clients match
```

### `/api/companies/route.test.ts`

```
# Test: GET returns paginated company list
# Test: GET passes limit and nextToken to SDK for pagination
```

### `/api/notes/route.test.ts`

```
# Test: GET returns notes filtered by entityType and entityId
# Test: POST creates note with valid body and returns created note
# Test: POST returns 400 when required fields missing (zod validation)
# Test: PUT updates note content by id
# Test: PUT returns 400 when body fails zod validation
# Test: DELETE removes note by id
# Test: DELETE returns 404 when note id doesn't exist
```

### `/api/tasks/route.test.ts`

```
# Test: GET returns tasks, optionally filtered by clientId/companyId/status
# Test: POST creates task with valid body
# Test: POST returns 400 when required fields missing
# Test: PUT updates task status and fields by id
# Test: DELETE removes task by id
```

### `/api/files/route.test.ts`

```
# Test: GET returns file list
# Test: POST creates file from request body
# Test: POST returns 400 when file data is missing
```

## Implementation Details

### Shared Helper: Token Extraction

Every route needs to extract the token from the Authorization header. Create a small helper function (either inline in each route or in a shared utility) with this logic:

```typescript
/** Extract bearer token from Authorization header. Returns null if missing/invalid. */
function extractToken(request: Request): string | null
```

Parse the `Authorization` header with format `Bearer <token>`. Return `null` if the header is missing, empty, or does not start with `Bearer `.

When the token is null, respond immediately with:

```typescript
Response.json({ error: 'Authorization header required' }, { status: 401 })
```

Consider placing this helper in a shared file like `/Users/neil/code/custom-apps/custom-app-base/app/api/_helpers.ts` so all routes can import it, but inlining it in each route is also acceptable given the small number of routes.

### Shared Helper: SDK Initialization

After extracting the token, every route initializes the SDK the same way:

```typescript
const apiKey = need<string>(process.env.ASSEMBLY_API_KEY, 'ASSEMBLY_API_KEY is required');
const assembly = assemblyApi({ apiKey, token });
```

### Error Handling Pattern

Every route wraps SDK calls in try/catch. The catch block maps errors to structured responses:

```typescript
// Consistent error shape matching ApiError interface from utils/types.ts
{ error: string }
```

Map SDK errors to appropriate HTTP status codes:
- 400 for zod validation failures
- 401 for missing/invalid auth
- 404 for not found (if SDK throws with a 404-like message)
- 500 for unexpected errors

### Input Validation with Zod

Mutation routes (POST, PUT, DELETE on notes/tasks/files) validate request bodies using `zod` schemas. Define schemas inline in each route file. The `zod` package is already in dependencies.

Example for note creation:

```typescript
import { z } from 'zod';

const createNoteSchema = z.object({
  entityType: z.enum(['client', 'company']),
  entityId: z.string().min(1),
  title: z.string().min(1),
  content: z.string().optional(),
});
```

On validation failure, return `Response.json({ error: formatted zod error message }, { status: 400 })`.

### Route: `/api/clients/route.ts`

**Exports:** `GET`

The GET handler:
1. Extracts token from Authorization header
2. Reads optional query params: `companyId`, `limit`, `nextToken`
3. Parses `limit` as a number (default 20)
4. Calls `assembly.listClients({ companyId, limit, nextToken })`
5. Returns the response directly as JSON

### Route: `/api/companies/route.ts`

**Exports:** `GET`

The GET handler:
1. Extracts token from Authorization header
2. Reads optional query params: `limit`, `nextToken`
3. Calls `assembly.listCompanies({ limit, nextToken })`
4. Returns the response directly as JSON

### Route: `/api/notes/route.ts`

**Exports:** `GET`, `POST`, `PUT`, `DELETE`

**GET:** List notes filtered by `entityType` and `entityId` query params. Also accepts `limit` and `nextToken`. Calls `assembly.listNotes(...)`.

**POST:** Create a note. Parse JSON body, validate with `createNoteSchema` (requires `entityType`, `entityId`, `title`; optional `content`). Call `assembly.createNote({ requestBody: validatedBody })`.

**PUT:** Update a note. Parse JSON body, validate with `updateNoteSchema` (requires `id`; optional `title`, `content`). Call `assembly.updateNote({ id, requestBody: { title, content } })`.

**DELETE:** Delete a note. Read `id` from query params. Call `assembly.deleteNote({ id })`. Return the deletion confirmation. If the SDK throws a not-found error, return 404.

### Route: `/api/tasks/route.ts`

**Exports:** `GET`, `POST`, `PUT`, `DELETE`

**GET:** List tasks. Read optional query params: `clientId`, `companyId`, `status`, `limit`, `nextToken`. Call `assembly.retrieveTasks(...)` (note: the SDK method is named `retrieveTasks`, not `listTasks`).

**POST:** Create a task. Parse JSON body, validate with `createTaskSchema` (requires `name`; optional `description`, `status`, `clientId`, `companyId`, `dueDate`). Call `assembly.createTask({ requestBody: validatedBody })`.

**PUT:** Update a task. Parse JSON body, validate with `updateTaskSchema` (requires `id`; optional `name`, `description`, `status`, `dueDate`, `isArchived`). Call `assembly.updateTask({ id, requestBody: rest })`.

**DELETE:** Delete a task. Read `id` from query params. Call `assembly.deleteTask({ id })`.

### Route: `/api/files/route.ts`

**Exports:** `GET`, `POST`

**GET:** List files. Read required `channelId` query param and optional `path`, `limit`, `nextToken`. Call `assembly.listFiles({ channelId, path, nextToken, limit })`. Return 400 if `channelId` is missing.

**POST:** Create a file object (file, folder, or link). Parse JSON body, validate with `createFileSchema` (requires `fileType`, `path`, `channelId`; optional `linkUrl`, `clientPermissions`). Call `assembly.createFile({ fileType, requestBody: { path, channelId, linkUrl, clientPermissions } })`.

Note: The SDK `createFile` method creates file metadata (folders, links). Actual file content upload uses a separate mechanism (pre-signed URLs). For this example app, the route handles metadata creation only. This is an intentional simplification.

### Existing Route: `/api/request/route.ts`

This route remains unchanged. It is used by the examples page (Section 08) and the existing `RequestTester` component.

## Implementation Checklist

1. Create test files for all five routes with the test stubs listed above
2. Create shared token extraction helper (inline or in `app/api/_helpers.ts`)
3. Implement `/api/clients/route.ts` (GET only)
4. Implement `/api/companies/route.ts` (GET only)
5. Implement `/api/notes/route.ts` (GET, POST, PUT, DELETE) with zod validation
6. Implement `/api/tasks/route.ts` (GET, POST, PUT, DELETE) with zod validation
7. Implement `/api/files/route.ts` (GET, POST) with zod validation
8. Verify all tests pass with `npx vitest run`