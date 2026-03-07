# Opus Review

**Model:** claude-opus-4
**Generated:** 2026-03-07T00:00:00Z

---

## Plan Review: Custom App Base Improvement

### Overall Assessment

The plan is well-structured and logically sequenced. The view-routing strategy, directory layout, and data flow are sound. However, there are several significant gaps and risks that should be addressed before implementation begins.

---

### 1. Security: Token Passed in Query Parameters for Mutations

**Section 2, line 111**: The plan says POST/PUT/DELETE routes extract the token from the request body, while GET extracts from query params. This is inconsistent and the body approach is never formalized.

More critically, passing the session token as a query parameter in GET requests means it will appear in browser history, server logs, referrer headers, and any analytics tooling. For an app that is already embedded in an iframe, the token is somewhat protected, but it should still be treated carefully.

**Recommendation**: Standardize on passing the token via an `Authorization` header (e.g., `Bearer <token>`) from all client-side fetch calls. The `useApi` hook in Section 3 is the perfect place to centralize this. Update the API routes to read from the header consistently. This also avoids URL length limits for complex query strings.

---

### 2. API Routes Have No Error Handling

**Section 2** (lines 110-145) describes all API routes but never mentions error handling. There is no guidance on:
- What happens when the SDK throws (network error, 401, 404, rate limit)
- What HTTP status codes the API routes should return
- How to format error responses consistently
- How client components should display errors

The `useApi` hook in Section 3 returns `error: Error | undefined` but there is no pattern for what that error object looks like or how to surface it in the UI.

**Recommendation**: Add an explicit error handling pattern to Section 2 -- a try/catch wrapper around SDK calls in every route, returning structured JSON errors with appropriate HTTP status codes. Define the error shape in `utils/types.ts`. Add error display guidance to the resource components.

---

### 3. API Routes Have No Input Validation

**Section 2**: None of the route descriptions mention validating incoming parameters. The plan includes `zod` in dependencies (`package.json` line 86), but never mentions using it. Unvalidated query params and request bodies from client-side code are a reliability risk, especially for mutations where `entityType`, `entityId`, and `content` are passed from the client.

**Recommendation**: Add a brief subsection to Section 2 establishing that each route should validate its inputs (using zod schemas) before passing them to the SDK. This is especially important for the mutation endpoints.

---

### 4. Missing Token Refresh Handling

**Research doc line 51**: "Parent frame auto-refreshes tokens and pushes updates via bridge." The plan never addresses this. If the parent refreshes the token, all client-side API calls need to use the new token. The `TokenProvider` is listed as "no changes" (line 47), but the current implementation may or may not handle bridge token updates.

**Recommendation**: Explicitly verify that the `TokenProvider` listens for bridge token refresh events and updates the context value. If it does not, this needs to be added. The `useApi` hook's SWR cache keys include the token, so a token change would invalidate all cached data -- document whether this is desired behavior or if a migration strategy is needed.

---

### 5. The `/detail` Route Creates a Security Concern

**Section 5, lines 224-228**: The detail page accepts `clientId` or `companyId` as query parameters for in-app navigation. This means a user could manually craft a URL with any arbitrary `clientId` and potentially view data they should not have access to. The plan relies on the token to scope SDK calls, but the `clientId` in the query param is used to fetch entity data server-side.

**Recommendation**: Clarify that the `/detail` route must always use the token for authorization -- the `clientId`/`companyId` in query params should only be used to specify which entity to display, and the SDK call made with the token should enforce access control. If the SDK does not enforce this (i.e., an internal user token can access any client), document that this is expected behavior. If it does enforce it, document what error the route should return.

---

### 6. No Loading States Defined

The plan describes `EmptyState` (Section 9) but never mentions loading states or skeleton UIs. SWR will have an `isLoading` state, but there is no component or pattern for showing loading indicators during data fetches. For an example app meant to demonstrate best practices, this is a notable omission.

**Recommendation**: Add a `LoadingState` or skeleton component to the shared components. Reference it in the resource component descriptions.

---

### 7. File Upload is Under-Specified

**Section 6, lines 262-268** (`FilesList.tsx`): File upload is mentioned in one line ("POST to `/api/files`") with "show upload progress if feasible." This is by far the most complex feature in the plan and it is the least specified:

- How does the file get from the browser to the API route? `FormData`? Base64 in JSON body? The Next.js API route body size limit (default 1MB for serverless) will be hit quickly.
- The SDK's `createFile` method likely requires specific parameters (content type, entity association, etc.) that are not documented in the plan.
- Upload progress requires `XMLHttpRequest` or a streaming approach -- SWR's `fetch` wrapper does not support progress events.

**Recommendation**: Either properly specify the file upload flow (including body size configuration in `next.config.js`, the multipart handling strategy, and progress approach), or explicitly scope file upload as "list files only, upload deferred to future work." Half-implementing file upload will create a frustrating example.

---

### 8. SWR Dependency is Already Present, but `react-hook-form` Integration Unclear

**Section 6, line 245**: The plan says `NoteForm` uses `react-hook-form` for form state. This is fine, but the mutation flow is unclear. After a `react-hook-form` submit handler calls `fetch` to POST/PUT, how does it trigger SWR revalidation? The `useApiMutation` mentioned in Section 3 (line 166) is described as "or utility function" -- this ambiguity will lead to inconsistent mutation patterns across the three resource types.

**Recommendation**: Define `useApiMutation` concretely. Specify its signature, how it receives the SWR mutate function, and show the integration pattern with `react-hook-form`'s `onSubmit`. All three resource forms should follow the same pattern.

---

### 9. The `(home)` Route Group is Not Addressed

The research doc (line 20) shows the current app uses a `(home)` route group: `app/(home)/page.tsx`. The plan's target structure (Section "Target Directory Structure") shows `app/page.tsx` directly. It is unclear whether the `(home)` group gets deleted, merged, or left in place. If left in place, there could be routing conflicts.

**Recommendation**: Explicitly state that the `(home)` route group is removed and its content migrated to `app/examples/`. This prevents ambiguity during implementation.

---

### 10. Bridge CTA Updates on Tab Change are Tricky

**Section 6, line 272**: `ResourceTabs` "updates bridge primary CTA based on active tab." This means changing the primary CTA label and callback every time the user switches between Notes/Tasks/Files tabs. Bridge hooks use `useRef` for callback stability, but rapidly switching tabs could cause stale callbacks if the hook cleanup and re-registration have timing issues.

**Recommendation**: Add a note that CTA updates should debounce or use the latest-ref pattern to avoid stale closures. Test the tab-switching scenario specifically.

---

### 11. Bloated `package.json`

The current `package.json` includes `@vercel/postgres`, `drizzle-orm`, `drizzle-kit`, `postgres`, `ai`, `@ai-sdk/react`, `v0-sdk`, `@v0-sdk/react`, `bcrypt-ts`, and many other dependencies that seem unrelated to the custom app base. These appear to be artifacts of the `vercel` branch being based on a different template.

**Recommendation**: The plan should include a cleanup step that removes unused dependencies. An example app with 60+ dependencies (many irrelevant) sends the wrong signal to developers cloning this template.

---

### 12. No Consideration for Concurrent Mutations

**Section 6**: Multiple resource components support create/edit/delete. What happens if a user clicks "Delete Note" and then immediately clicks "Add Note" before the delete completes? Or edits two notes in rapid succession? There is no mention of optimistic updates, mutation locking, or disabled states during pending operations.

**Recommendation**: At minimum, add guidance that mutation buttons should be disabled while a mutation is in flight. SWR's `useSWRMutation` could be a better fit than a custom `useApiMutation` since it provides `isMutating` state out of the box.

---

### 13. The Examples Page Migration is Vague

**Section 8** (lines 299-313): "Move the existing section components from `app/(home)/sections/` to a new location under `app/examples/` or keep them in place and reference from the examples page." This indecision will cause confusion during implementation.

**Recommendation**: Pick one approach. Moving them to `app/examples/sections/` is cleaner and avoids orphaned code in the `(home)` directory.

---

### 14. Missing: How Does the Client View Know Its Entity Context?

**Section 7, line 290**: "Data automatically scoped to client's own resources via token." This is true for the SDK calls, but the `ResourceTabs` component needs `entityType` and `entityId` props (Section 6, line 272). Where do these come from in the client view? The session data has the client info, but the plan does not show how `ClientView` extracts and passes `entityType='client'` and `entityId=session.client.id` to `ResourceTabs`.

**Recommendation**: Make the data flow explicit in Section 7. Show that `ClientView` derives `entityType` and `entityId` from session data and passes them to `ResourceTabs`.

---

### 15. Types Importing from `@assembly-js/node-sdk` in Client Components

**Section 9, line 333**: "Import actual SDK types (Client, Company, etc.) from `@assembly-js/node-sdk` rather than recreating them." The node SDK is a server-side dependency. Importing types from it in client components could pull the module into the client bundle, depending on how the SDK package is structured (whether types are exported separately from runtime code).

**Recommendation**: Verify that importing types from `@assembly-js/node-sdk` in client files does not cause bundle bloat. If it does, define lightweight interface types in `utils/types.ts` that mirror the SDK types but are safe for client import. TypeScript `import type` should handle this, but the plan should explicitly mandate `import type` syntax.

---

### Summary of Highest-Priority Items

1. **Error handling pattern for API routes** -- without this, every route implementation will ad-hoc its own approach
2. **File upload specification** -- either scope it properly or defer it
3. **Token passing via headers** instead of query params
4. **`useApiMutation` concrete definition** -- the mutation pattern is the core differentiator of this app vs the current demo
5. **Clean up the `(home)` route group** -- state clearly what gets deleted
6. **Remove unused dependencies** from `package.json`
