# Integration Notes: Opus Review

## Integrating

### 1. Token via Authorization Header (Review #1)
**Integrating.** Standardizing on `Authorization: Bearer <token>` header is cleaner than query params for mutations. The `useApi` hook is the right place to centralize this. This also addresses consistency between GET and POST/PUT/DELETE.

### 2. API Route Error Handling (Review #2)
**Integrating.** Adding a consistent error handling pattern to Section 2 with try/catch, structured error responses, and appropriate HTTP status codes. Essential for a realistic example app.

### 3. Input Validation with Zod (Review #3)
**Integrating.** Brief mention that mutation routes should validate request bodies with zod schemas before passing to SDK. Keeps it lightweight.

### 4. `(home)` Route Group Cleanup (Review #9)
**Integrating.** Explicitly stating that `(home)` route group is removed and content migrated to `app/examples/`.

### 5. Examples Page Migration Decision (Review #13)
**Integrating.** Picking the concrete approach: move to `app/examples/sections/`.

### 6. Client View Entity Context (Review #14)
**Integrating.** Making the `entityType`/`entityId` data flow explicit in Section 7.

### 7. `useApiMutation` Concrete Definition (Review #8)
**Integrating.** Defining the mutation hook signature and SWR revalidation pattern concretely in Section 3.

### 8. Loading States (Review #6)
**Integrating.** Adding a brief mention of loading state pattern using SWR's `isLoading`.

### 9. Concurrent Mutation Protection (Review #12)
**Integrating.** Adding guidance on disabling mutation buttons while in-flight. Recommending `useSWRMutation` for its `isMutating` state.

### 10. `import type` for SDK Types (Review #15)
**Integrating.** Mandating `import type` syntax for SDK type imports in client components.

## NOT Integrating

### Token Refresh Handling (Review #4)
**Not integrating.** The existing TokenProvider already handles this via bridge events. Adding token refresh documentation is out of scope for this plan - it's existing infrastructure, not new work.

### `/detail` Route Security (Review #5)
**Not integrating as a separate concern.** The SDK enforces access control via the token. Internal users are expected to access any client (that's the product design). The token-based SDK call is the authorization layer. No additional guard needed.

### File Upload Specification (Review #7)
**Not integrating full specification.** The plan already appropriately scopes file upload as basic (list + upload). Deferring upload progress to future work is fine for an example app. Will add a note that upload is intentionally simplified.

### Bridge CTA Debouncing (Review #10)
**Not integrating.** This is an implementation detail that the developer will handle when building the component. The plan doesn't need to prescribe debounce strategies.

### Dependency Cleanup (Review #11)
**Not integrating.** The `vercel` branch dependencies are inherited from the platform template. Cleaning them up is a separate task outside the scope of this feature plan, and many may be needed by the platform build process.
