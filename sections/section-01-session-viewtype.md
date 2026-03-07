Now I have everything I need. The source files live at the project root (not in `src/`), with `@/*` mapping to the root. Let me produce the section content.

# Section 1: Session and View Type Detection

## Overview

This section extends the existing `utils/session.ts` to classify the viewing context as one of three `ViewType` values based on the token payload, and updates the root `app/page.tsx` to route to the correct view component accordingly. This is the foundational section that all view-rendering sections (02, 04, 05, 07) depend on.

## Background

The Assembly custom app runs as an iframe. The platform passes a `token` query parameter that encodes which user is viewing the app and in what context. The SDK method `assembly.getTokenPayload()` returns a `Token` object with these optional fields:

- `clientId?: string`
- `companyId?: string`
- `internalUserId?: string`
- `workspaceId: string`

The combination of these fields determines what the user should see:

| Token Contains | ViewType | Meaning |
|---|---|---|
| `internalUserId` only | `internal-overview` | Internal user browsing all clients/companies |
| `internalUserId` + `clientId` or `companyId` | `internal-detail` | Internal user viewing a specific entity |
| `clientId` (no `internalUserId`) | `client` | Client user in client portal |

## Files to Create or Modify

- **Modify**: `/Users/neil/code/custom-apps/custom-app-base/utils/session.ts` -- add `ViewType` type, add `viewType` field to return value
- **Modify**: `/Users/neil/code/custom-apps/custom-app-base/app/page.tsx` -- replace re-export with server component that routes by view type
- **Create**: `/Users/neil/code/custom-apps/custom-app-base/__tests__/utils/session.test.ts` -- unit tests for view type detection
- **Create**: `/Users/neil/code/custom-apps/custom-app-base/__tests__/app/page.test.tsx` -- tests for home page routing

## Existing Code Context

The project uses a root-level directory structure (no `src/` prefix). Path alias `@/*` maps to the project root. The existing `utils/session.ts` already fetches workspace, client, company, and internal user data based on the token payload. It exports a `SessionData` type inferred from `getSession`'s return type.

Key existing files:
- `utils/session.ts` -- the `getSession` function and `SessionData` type
- `app/page.tsx` -- currently just re-exports from `app/(home)/page.tsx`
- `app/(home)/page.tsx` -- current home page with demo sections, handles missing token and missing API key
- `app/(home)/sections/GettingStarted.tsx` -- component shown when no token
- `app/(home)/sections/MissingApiKey.tsx` -- component shown when no API key
- `app/providers/TokenProvider.tsx` -- provides token to client components via React context
- `declarations.d.ts` -- declares the `SearchParams` type as `{ [key: string]: string | string[] | undefined }`

## Tests First

Create `/Users/neil/code/custom-apps/custom-app-base/__tests__/utils/session.test.ts`.

Note: Vitest is not yet in the project dependencies. Install `vitest` as a dev dependency and create a `vitest.config.ts` at the project root before running tests. The config should handle the `@/*` path alias (use `resolve.alias` or the `vite-tsconfig-paths` plugin).

### Session Tests

These tests validate the `viewType` derivation logic. Since `getSession` calls the Assembly SDK (which makes real API requests), the SDK must be mocked. Mock `@assembly-js/node-sdk` so that `assemblyApi` returns a fake SDK object with controllable `getTokenPayload`, `retrieveWorkspace`, `retrieveClient`, `retrieveCompany`, and `retrieveInternalUser` methods.

Test stubs:

```typescript
// __tests__/utils/session.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the SDK module before importing getSession
vi.mock('@assembly-js/node-sdk', () => ({
  assemblyApi: vi.fn(),
}));

import { getSession } from '@/utils/session';
import { assemblyApi } from '@assembly-js/node-sdk';

describe('getSession', () => {
  // Setup: create a mock SDK object and configure assemblyApi to return it.
  // Set process.env.ASSEMBLY_API_KEY to a test value.

  it('returns viewType "internal-overview" when token has internalUserId only', async () => {
    // Configure getTokenPayload to return { internalUserId: '123', workspaceId: 'ws' }
    // Assert: result.viewType === 'internal-overview'
  });

  it('returns viewType "internal-detail" when token has internalUserId + clientId', async () => {
    // Configure getTokenPayload to return { internalUserId: '123', clientId: '456', workspaceId: 'ws' }
    // Assert: result.viewType === 'internal-detail'
  });

  it('returns viewType "internal-detail" when token has internalUserId + companyId', async () => {
    // Configure getTokenPayload to return { internalUserId: '123', companyId: '789', workspaceId: 'ws' }
    // Assert: result.viewType === 'internal-detail'
  });

  it('returns viewType "client" when token has clientId without internalUserId', async () => {
    // Configure getTokenPayload to return { clientId: '456', workspaceId: 'ws' }
    // Assert: result.viewType === 'client'
  });

  it('throws when API key is missing', async () => {
    // Delete process.env.ASSEMBLY_API_KEY
    // Assert: getSession throws with message containing 'ASSEMBLY_API_KEY'
  });
});
```

### Home Page Tests

Create `/Users/neil/code/custom-apps/custom-app-base/__tests__/app/page.test.tsx`.

These tests verify that the home page renders the correct view component based on the session's `viewType`. Since the home page is a server component (async), testing it requires either rendering it directly in a test environment that supports RSC, or testing the routing logic in isolation. The pragmatic approach is to extract the view-routing logic into a testable function and/or test the page as an async function that returns JSX.

Test stubs:

```typescript
// __tests__/app/page.test.tsx
import { describe, it, expect, vi } from 'vitest';

describe('Home page', () => {
  it('renders InternalOverview when viewType is "internal-overview"', async () => {
    // Mock getSession to return { viewType: 'internal-overview', ... }
    // Verify the correct component is selected
  });

  it('renders DetailView when viewType is "internal-detail"', async () => {
    // Mock getSession to return { viewType: 'internal-detail', ... }
  });

  it('renders ClientView when viewType is "client"', async () => {
    // Mock getSession to return { viewType: 'client', ... }
  });

  it('renders GettingStarted when token is missing', async () => {
    // Pass searchParams without token
  });

  it('renders MissingApiKey when API key is not configured', async () => {
    // Remove ASSEMBLY_API_KEY from env
  });
});
```

## Implementation Details

### 1. Extend `utils/session.ts`

Add the `ViewType` type and a `determineViewType` helper function. Modify `getSession` to include `viewType` in its return value.

**`ViewType` type** -- define as a union of three string literals:

```typescript
export type ViewType = 'internal-overview' | 'internal-detail' | 'client';
```

**`determineViewType` function** -- a pure function (easy to unit test) that takes the token payload and returns a `ViewType`:

```typescript
export function determineViewType(tokenPayload: {
  internalUserId?: string;
  clientId?: string;
  companyId?: string;
} | undefined): ViewType {
  // Logic:
  // 1. If internalUserId present AND (clientId or companyId) present -> 'internal-detail'
  // 2. If internalUserId present AND neither clientId nor companyId -> 'internal-overview'
  // 3. If clientId present AND no internalUserId -> 'client'
  // 4. Fallback: 'internal-overview' (for edge cases like no payload)
}
```

**Modify `getSession` return value** -- after determining the token payload (line 33 in current file), call `determineViewType(tokenPayload)` and include it in the returned `data` object:

```typescript
const data: {
  viewType: ViewType;
  workspace: ...;
  client?: ...;
  company?: ...;
  internalUser?: ...;
} = {
  viewType: determineViewType(tokenPayload ?? undefined),
  workspace: await assembly.retrieveWorkspace(),
};
```

The existing `SessionData` type (`Awaited<ReturnType<typeof getSession>>`) will automatically pick up the new `viewType` field.

Export both `ViewType` and `determineViewType` so they can be imported by other modules and tested independently.

### 2. Update `app/page.tsx`

Replace the current one-line re-export with a proper server component that:

1. Checks for `ASSEMBLY_API_KEY` -- if missing, renders `MissingApiKey`
2. Checks for `token` in search params -- if missing, renders `GettingStarted`
3. Calls `getSession(searchParams)` to get session data including `viewType`
4. Extracts the token string from search params
5. Wraps the view component in `TokenProvider` and `BridgeConfigProvider`
6. Routes to the correct view based on `viewType`:
   - `'internal-overview'` renders a placeholder `InternalOverview` component (built in section 04)
   - `'internal-detail'` renders a placeholder `DetailView` component (built in section 05)
   - `'client'` renders a placeholder `ClientView` component (built in section 07)

For this section, create minimal placeholder client components for the three views. Each placeholder should accept `session` (of type `SessionData`) and render a simple message indicating which view is active. These will be replaced with real implementations in later sections.

Placeholder files to create:
- `/Users/neil/code/custom-apps/custom-app-base/components/views/InternalOverview.tsx`
- `/Users/neil/code/custom-apps/custom-app-base/components/views/DetailView.tsx`
- `/Users/neil/code/custom-apps/custom-app-base/components/views/ClientView.tsx`

Each placeholder is a `'use client'` component that receives `session: SessionData` and `token: string` as props. The placeholder body can be a `<div>` with a `Body` text from the design system indicating the view name.

The new `app/page.tsx` should preserve `export const dynamic = 'force-dynamic'` from the old home page, and keep the pattern of checking API key and token before calling `getSession`.

### 3. Vitest Configuration

Create `/Users/neil/code/custom-apps/custom-app-base/vitest.config.ts` with:
- Path alias resolution matching `tsconfig.json` (`@/*` maps to project root)
- Test file glob pattern: `__tests__/**/*.{test,spec}.{ts,tsx}`
- Environment: `jsdom` (for component tests in later sections; pure logic tests in this section do not require it, but setting it up now avoids reconfiguration later)
- Any Next.js-specific transforms needed (consider `@vitejs/plugin-react` or similar if JSX tests are included)

Add `vitest` to devDependencies (and `@vitejs/plugin-react`, `jsdom` if using jsdom environment).

## Dependencies

This section has no dependencies on other sections. It is a prerequisite for:
- Section 02 (API Routes) -- needs token extraction patterns
- Section 04 (Internal Overview) -- replaces the `InternalOverview` placeholder
- Section 05 (Detail View) -- replaces the `DetailView` placeholder
- Section 07 (Client View) -- replaces the `ClientView` placeholder

## Acceptance Criteria

- `getSession` returns a `viewType` field with the correct value for each token payload combination
- `determineViewType` is exported and independently testable
- `ViewType` type is exported from `utils/session.ts`
- `app/page.tsx` renders the correct placeholder view based on session `viewType`
- `app/page.tsx` still renders `MissingApiKey` when `ASSEMBLY_API_KEY` is absent
- `app/page.tsx` still renders `GettingStarted` when token is absent
- All tests in `__tests__/utils/session.test.ts` pass
- Vitest is configured and runnable via `npx vitest run`