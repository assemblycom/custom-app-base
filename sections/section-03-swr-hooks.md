I now have all the context needed. Note that the project uses `@/*` path aliases rooted at the project root, and source files are under `app/`, `utils/`, etc. (no `src/` prefix). The plan references `src/hooks/useApi.ts` but the actual structure is flat -- so the file should be `hooks/useApi.ts`.

# Section 3: SWR Data Fetching Hooks

## Overview

This section creates two custom hooks in `hooks/useApi.ts` that provide a consistent data fetching and mutation layer for all client components. The hooks wrap SWR and centralize Authorization header injection using the token from `TokenProvider`.

**Dependencies**: This section depends on:
- **Section 2 (API Routes)**: The hooks call the API routes created there
- **TokenProvider** at `app/providers/TokenProvider.tsx`: Provides the `useToken()` hook that returns the session token string

**Blocks**: Sections 4, 5, 6, and 7 all consume these hooks for data fetching and mutations.

## Key Files

| File | Action |
|------|--------|
| `hooks/useApi.ts` | **Create** - Contains `useApi` and `useApiMutation` hooks |
| `hooks/__tests__/useApi.test.ts` | **Create** - Tests for both hooks |

## Background Context

The app runs as an iframe embedded in Assembly.com. A session token is passed via query parameter and stored in React context by `TokenProvider`. All API routes (created in Section 2) expect the token via an `Authorization: Bearer <token>` header. The hooks centralize this pattern so individual components never construct fetch calls manually.

The `useToken()` hook from `app/providers/TokenProvider.tsx` returns the token string and throws if called outside a `TokenProvider`. The full implementation:

```typescript
// app/providers/TokenProvider.tsx
'use client';
import { createContext, useContext } from 'react';

const TokenContext = createContext<string | null>(null);

export function TokenProvider({ token, children }: { token: string; children: React.ReactNode }) {
  return <TokenContext.Provider value={token}>{children}</TokenContext.Provider>;
}

export function useToken() {
  const token = useContext(TokenContext);
  if (!token) {
    throw new Error('useToken must be used within a TokenProvider');
  }
  return token;
}
```

The project already has `swr` (v2.3.6) in dependencies. Path aliases use `@/*` mapped to the project root (e.g., `@/hooks/useApi`).

API routes return structured errors matching this shape (defined in `utils/types.ts` from Section 9, but can be defined inline if Section 9 is not yet implemented):

```typescript
interface ApiError {
  error: string;
  status: number;
}
```

## Tests First

Create `hooks/__tests__/useApi.test.ts`. The tests use Vitest and `@testing-library/react` with `renderHook`. Mock `fetch` globally and wrap hooks in a `TokenProvider` to supply the token.

Note: Vitest and `@testing-library/react` may need to be added as dev dependencies. A `vitest.config.ts` must exist at the project root. These testing infrastructure concerns may be handled by another section or as a prerequisite.

### `useApi` Tests

```
Test: useApi constructs URL with endpoint and query params
  - Call useApi('/api/clients', { companyId: 'abc', limit: '10' })
  - Assert fetch was called with '/api/clients?companyId=abc&limit=10'

Test: useApi includes Authorization header with token from context
  - Render hook inside TokenProvider with token='test-token-123'
  - Assert fetch was called with headers containing 'Authorization: Bearer test-token-123'

Test: useApi returns isLoading true while fetching
  - Mock fetch to return a pending promise
  - Assert result.current.isLoading is true

Test: useApi returns data on successful fetch
  - Mock fetch to resolve with { items: [...] }
  - Wait for hook to settle
  - Assert result.current.data matches the mock response

Test: useApi returns error on failed fetch
  - Mock fetch to resolve with status 500 and error body
  - Wait for hook to settle
  - Assert result.current.error is defined

Test: useApi mutate function triggers refetch
  - Mock fetch to resolve with data
  - Wait for initial load
  - Call result.current.mutate()
  - Assert fetch was called again
```

### `useApiMutation` Tests

```
Test: trigger sends POST with JSON body and Authorization header
  - Call trigger('POST', { content: 'hello' })
  - Assert fetch called with method POST, JSON body, Authorization header, Content-Type application/json

Test: trigger sends PUT with JSON body and Authorization header
  - Call trigger('PUT', { id: '1', content: 'updated' })
  - Assert fetch called with method PUT, correct body and headers

Test: trigger sends DELETE with Authorization header
  - Call trigger('DELETE')
  - Assert fetch called with method DELETE and Authorization header

Test: isMutating is true during in-flight request
  - Mock fetch to return a delayed promise
  - Call trigger
  - Assert result.current.isMutating is true before resolution

Test: isMutating returns to false after request completes
  - Call trigger, await completion
  - Assert result.current.isMutating is false

Test: successful mutation triggers SWR revalidation for related cache key
  - This tests that after a successful mutation, the SWR cache for the endpoint is revalidated
  - Can verify by checking that useSWRConfig().mutate or the bound mutate is called

Test: failed mutation parses ApiError from response
  - Mock fetch to resolve with status 400 and { error: 'Invalid input', status: 400 }
  - Call trigger, await rejection/error state
  - Assert result.current.error contains the parsed ApiError message
```

## Implementation Details

### `hooks/useApi.ts`

This file exports two hooks: `useApi` and `useApiMutation`.

#### `useApi<T>` Hook

Signature:

```typescript
function useApi<T>(endpoint: string, params?: Record<string, string>): {
  data: T | undefined;
  error: Error | undefined;
  isLoading: boolean;
  mutate: () => void;
}
```

Implementation approach:
- Import `useSWR` from `swr` and `useToken` from `@/app/providers/TokenProvider`
- Construct the SWR key as the full URL with query params appended (e.g., `/api/clients?limit=10`). Use `URLSearchParams` to build the query string. Filter out `undefined` values from params before constructing.
- Define a fetcher function that calls `fetch(url, { headers: { Authorization: 'Bearer ' + token } })`, checks `response.ok`, parses JSON, and throws on non-OK responses
- Pass the URL key and fetcher to `useSWR`
- Return `{ data, error, isLoading, mutate }` from the SWR result
- SWR defaults are sufficient (revalidateOnFocus, deduplication are on by default). No custom config overrides needed.

#### `useApiMutation` Hook

Signature:

```typescript
function useApiMutation(endpoint: string): {
  trigger: (method: 'POST' | 'PUT' | 'DELETE', body?: unknown) => Promise<unknown>;
  isMutating: boolean;
  error: Error | undefined;
}
```

Implementation approach:
- Import `useToken` and `useSWRConfig` (or `useSWRMutation` from `swr/mutation`)
- Two viable strategies:
  1. **Manual state management**: Use `useState` for `isMutating` and `error`, and `useSWRConfig().mutate` to revalidate cache keys
  2. **`useSWRMutation`**: Use SWR's built-in mutation hook which provides `isMutating` out of the box
- The manual approach is simpler to understand and more explicit. Recommended for this example app.
- The `trigger` function:
  1. Sets `isMutating` to `true`, clears any previous error
  2. Calls `fetch(endpoint, { method, headers: { Authorization, Content-Type: 'application/json' }, body: JSON.stringify(body) })`
  3. If response is not OK, parse the JSON body as `ApiError` and throw an `Error` with the message
  4. On success, call `mutate(endpoint)` from `useSWRConfig()` to revalidate the SWR cache for that endpoint (this causes any `useApi` hooks watching that endpoint to refetch)
  5. Sets `isMutating` to `false` in the `finally` block
  6. Returns the parsed response data
- For DELETE requests, omit `Content-Type` and `body` if no body is provided
- Wrap the fetch in try/catch to capture errors into the `error` state

#### Key Design Decisions

- **Token injection is centralized**: Components never pass tokens manually. Both hooks read from `useToken()`.
- **SWR cache keys match API paths**: The cache key for `useApi('/api/notes', { entityId: '123' })` is `/api/notes?entityId=123`. When `useApiMutation('/api/notes')` calls `mutate`, it revalidates keys matching that endpoint. Use `useSWRConfig().mutate` with a key-matching function to revalidate all cache entries that start with the endpoint path, since different param combinations create different cache keys.
- **Error shape**: Hooks throw/store plain `Error` objects. The error message is extracted from the `ApiError.error` field returned by API routes. Components can display `error.message` directly.
- **No global SWR provider needed**: SWR works without a provider. The default cache is sufficient for this app.