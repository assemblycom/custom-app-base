Now I have all the context needed. Let me generate the section content.

# Section 8: Examples Page

## Overview

This section moves the existing demo/educational content from `app/(home)/sections/` to a new `app/examples/` route and removes the `(home)` route group. The current home page at `app/(home)/page.tsx` renders demo sections (RequestTester, HeaderControls, DesignShowcase, Resources, SessionContext, etc.) that will be preserved under `/examples`. The root `app/page.tsx` re-export is replaced by the new view-routing page built in Section 1.

This section has no dependencies on other sections and can be implemented in parallel with sections 01 and 09.

## Dependencies

- **None** -- this section is fully independent. It only moves existing files and creates a new page that re-assembles them at a different route.

## Background

The current file structure uses a Next.js route group `(home)` at `app/(home)/page.tsx` which is re-exported from `app/page.tsx`. The `(home)` route group contains section components that serve as educational demos:

- `BridgeConfigProvider.tsx` -- configures the app bridge with workspace portal URL
- `DesignShowcase.tsx` -- component gallery showing design system typography, buttons, icons
- `GettingStarted.tsx` -- landing page shown when no token is present
- `Header.tsx` -- ASCII art banner and description text
- `HeaderControls.tsx` -- interactive bridge hook demonstration (breadcrumbs, CTAs, actions menu)
- `MissingApiKey.tsx` -- setup instructions shown when API key is missing
- `RequestTester.tsx` -- interactive SDK operation tester (list/retrieve clients and companies)
- `Resources.tsx` -- documentation links (Custom Apps Guide, API Reference, Experts Directory)
- `SessionContext.tsx` -- displays decoded session token data (user, workspace, company info)

After this migration:
- All section components move from `app/(home)/sections/` to `app/examples/sections/`
- A new `app/examples/page.tsx` replaces the old `app/(home)/page.tsx`
- The `app/(home)/` directory is deleted entirely
- The root `app/page.tsx` no longer re-exports from `(home)` -- Section 1 will replace it with view routing logic

## Tests

Create test file at `__tests__/app/examples/page.test.tsx` (or colocate as preferred by the project). Testing framework is Vitest with `@testing-library/react`.

### Test: Examples page renders all existing demo sections

Render the examples page component and verify that the key demo sections are present in the output (RequestTester, HeaderControls, DesignShowcase, Resources headings).

### Test: Examples page is accessible and renders without errors

Render the examples page and assert it does not throw. Verify the page container and header elements exist.

### Test: GettingStarted section renders when no token

Verify that when the examples page is loaded without a token query parameter, the GettingStarted component is shown instead of the full examples content.

**Note on testing approach**: Since the examples page is a server component that calls `getSession`, tests will need to either mock the `getSession` function or test the client sub-components individually. The simplest approach is to extract the client-side content rendering into a client component that can be tested directly, and keep the server component thin.

## Implementation

### Step 1: Create `app/examples/sections/` directory

Move all files from `app/(home)/sections/` to `app/examples/sections/`. The files to move are:

- `BridgeConfigProvider.tsx`
- `DesignShowcase.tsx`
- `GettingStarted.tsx`
- `Header.tsx`
- `HeaderControls.tsx`
- `MissingApiKey.tsx`
- `RequestTester.tsx`
- `Resources.tsx`
- `SessionContext.tsx`

No content changes are needed in these files. Their internal imports (e.g., `@/components/Container`, `@/bridge/hooks`, `@assembly-js/design-system`) use path aliases that remain valid regardless of file location. The only imports that reference relative paths are the ones in the page file that imports from `./sections/`, which will be updated in the new page.

### Step 2: Create `app/examples/page.tsx`

Create a new server component page at `/Users/neil/code/custom-apps/custom-app-base/app/examples/page.tsx` that reproduces the same behavior as the old `app/(home)/page.tsx`. The structure should be:

- Export `const dynamic = 'force-dynamic'` to prevent static rendering
- The default export is an async function that receives `searchParams`
- If `ASSEMBLY_API_KEY` is not set, render `MissingApiKey`
- If no `token` in searchParams, render `GettingStarted`
- Otherwise, call `getSession(params)` and render all demo sections inside a `Container`:
  - `BridgeConfigProvider` with workspace `portalUrl`
  - `Header`
  - `Resources`
  - `SessionContext` with session data
  - `RequestTester` with token
  - `HeaderControls`
  - `DesignShowcase`

All imports update from `./sections/SectionName` to `./sections/SectionName` (same relative path since the sections directory moves with the page).

The page signature should match Next.js 16 conventions where `searchParams` is a `Promise<SearchParams>`:

```typescript
export default async function ExamplesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // await searchParams, then check for API key and token
}
```

### Step 3: Delete `app/(home)/` directory

Remove the entire `app/(home)/` directory after confirming all files have been moved to `app/examples/`.

Files to delete:
- `/Users/neil/code/custom-apps/custom-app-base/app/(home)/page.tsx`
- `/Users/neil/code/custom-apps/custom-app-base/app/(home)/sections/BridgeConfigProvider.tsx`
- `/Users/neil/code/custom-apps/custom-app-base/app/(home)/sections/DesignShowcase.tsx`
- `/Users/neil/code/custom-apps/custom-app-base/app/(home)/sections/GettingStarted.tsx`
- `/Users/neil/code/custom-apps/custom-app-base/app/(home)/sections/Header.tsx`
- `/Users/neil/code/custom-apps/custom-app-base/app/(home)/sections/HeaderControls.tsx`
- `/Users/neil/code/custom-apps/custom-app-base/app/(home)/sections/MissingApiKey.tsx`
- `/Users/neil/code/custom-apps/custom-app-base/app/(home)/sections/RequestTester.tsx`
- `/Users/neil/code/custom-apps/custom-app-base/app/(home)/sections/Resources.tsx`
- `/Users/neil/code/custom-apps/custom-app-base/app/(home)/sections/SessionContext.tsx`

### Step 4: Update `app/page.tsx`

The root `app/page.tsx` currently contains:

```typescript
export { default } from './(home)/page';
```

This re-export must be removed. Replace with a placeholder that will be overwritten by Section 1 (session and view type routing). A minimal placeholder could be:

```typescript
export default function Home() {
  return <div>App loading...</div>;
}
```

Alternatively, if Section 1 has already been implemented, the root page will already have the view-routing logic and this step is a no-op. The key point is that the `(home)` re-export must be removed since that directory no longer exists.

### Step 5: Preserve the `/api/request` route

The `RequestTester` component makes requests to `/api/request`. This API route at `app/api/request/route.ts` must remain in place -- it is not part of the `(home)` route group and does not need to move.

## Files Summary

**Files to create:**
- `/Users/neil/code/custom-apps/custom-app-base/app/examples/page.tsx`
- `/Users/neil/code/custom-apps/custom-app-base/app/examples/sections/BridgeConfigProvider.tsx` (moved)
- `/Users/neil/code/custom-apps/custom-app-base/app/examples/sections/DesignShowcase.tsx` (moved)
- `/Users/neil/code/custom-apps/custom-app-base/app/examples/sections/GettingStarted.tsx` (moved)
- `/Users/neil/code/custom-apps/custom-app-base/app/examples/sections/Header.tsx` (moved)
- `/Users/neil/code/custom-apps/custom-app-base/app/examples/sections/HeaderControls.tsx` (moved)
- `/Users/neil/code/custom-apps/custom-app-base/app/examples/sections/MissingApiKey.tsx` (moved)
- `/Users/neil/code/custom-apps/custom-app-base/app/examples/sections/RequestTester.tsx` (moved)
- `/Users/neil/code/custom-apps/custom-app-base/app/examples/sections/Resources.tsx` (moved)
- `/Users/neil/code/custom-apps/custom-app-base/app/examples/sections/SessionContext.tsx` (moved)

**Files to delete:**
- `/Users/neil/code/custom-apps/custom-app-base/app/(home)/page.tsx`
- `/Users/neil/code/custom-apps/custom-app-base/app/(home)/sections/` (entire directory)

**Files to modify:**
- `/Users/neil/code/custom-apps/custom-app-base/app/page.tsx` (remove `(home)` re-export)

**Files to preserve (no changes):**
- `/Users/neil/code/custom-apps/custom-app-base/app/api/request/route.ts`