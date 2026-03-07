Now I have all the context needed. Let me produce the section content.

# Section 5: Detail View

## Overview

This section builds the detail view displayed when an internal user views a specific client or company. It covers two files:

1. **`components/views/DetailView.tsx`** -- A client component that renders an entity header and a tabbed resource browser (Notes, Tasks, Files).
2. **`app/detail/page.tsx`** -- A server component for in-app navigation to the detail view via Next.js routing.

The detail view is shown in two scenarios:
- **Token-driven**: The token already contains `internalUserId` + `clientId`/`companyId` (the platform opened the app in a specific entity context). In this case, the root `app/page.tsx` renders `DetailView` directly (handled by section-01).
- **In-app navigation**: An internal user clicks a client or company row in the `InternalOverview` (section-04). The app uses `router.push('/detail?clientId=xxx&token=yyy')` to navigate, and `app/detail/page.tsx` handles this route.

## Dependencies

- **Section 01 (Session and ViewType)**: Provides `SessionData` with `viewType`, entity data, and token. The root `page.tsx` renders `DetailView` when `viewType === 'internal-detail'`.
- **Section 03 (SWR Hooks)**: Provides `useApi` for fetching entity data in the in-app navigation case.
- **Section 06 (Resource Components)**: Provides `ResourceTabs` which is rendered inside `DetailView`. Section 06 depends on this section being complete first (it needs to know the props contract).
- **Section 09 (Shared Utilities)**: Provides `SessionData` and `ViewType` types from `utils/types.ts`.

## Tests

All tests go in the file `/Users/neil/code/custom-apps/custom-app-base/__tests__/detail-view.test.tsx` (or split into two files if preferred: one for the component, one for the route).

### `DetailView.tsx` Tests

```
# Test: Renders entity header with name and info
# Test: Renders ResourceTabs with correct entityType and entityId
# Test: Sets bridge breadcrumbs with app name and entity name
# Test: Bridge breadcrumb first item navigates back to overview on click
```

### `app/detail/page.tsx` Tests

```
# Test: Extracts clientId from query params and fetches entity data
# Test: Extracts companyId from query params and fetches entity data
# Test: Returns error when neither clientId nor companyId provided
```

### Test Setup Notes

- Mock `@assembly-js/app-bridge` (specifically `AssemblyBridge.header.setBreadcrumbs`) to verify breadcrumb calls.
- Mock `next/navigation` (`useRouter`) to verify back-navigation behavior.
- Mock the `useApi` hook or the fetch layer to provide entity data without real API calls.
- Use `@testing-library/react` with a custom render wrapper that includes `TokenProvider` with a test token.
- For `app/detail/page.tsx` (a server component), test by invoking the component function directly with mock `searchParams` and asserting on the rendered output or by verifying it calls `getSession` / SDK methods correctly.

### Test Stubs

Tests should be written as stubs with descriptive names. For example:

```typescript
// __tests__/detail-view.test.tsx
import { describe, it, expect, vi } from 'vitest';

describe('DetailView', () => {
  it('renders entity header with name and info', () => {
    // Render DetailView with mock session data containing a client
    // Assert that the client name appears in the heading
    // Assert that key info (email, company name) appears
  });

  it('renders ResourceTabs with correct entityType and entityId', () => {
    // Render DetailView with entityType='client' and entityId='abc-123'
    // Assert ResourceTabs is rendered with those props
  });

  it('sets bridge breadcrumbs with app name and entity name', () => {
    // Render DetailView with an entity name
    // Assert AssemblyBridge.header.setBreadcrumbs was called with
    // [{ label: 'App Name', onClick: <function> }, { label: 'Entity Name' }]
  });

  it('bridge breadcrumb first item navigates back to overview on click', () => {
    // Render DetailView
    // Capture the onClick from the first breadcrumb item
    // Call it and assert router.push('/') was called
  });
});
```

```typescript
// __tests__/detail-page.test.tsx
import { describe, it, expect, vi } from 'vitest';

describe('app/detail/page.tsx', () => {
  it('extracts clientId from query params and fetches entity data', () => {
    // Call the page component with searchParams containing clientId and token
    // Assert it fetches the client via SDK and passes data to DetailView
  });

  it('extracts companyId from query params and fetches entity data', () => {
    // Call the page component with searchParams containing companyId and token
    // Assert it fetches the company via SDK and passes data to DetailView
  });

  it('returns error when neither clientId nor companyId provided', () => {
    // Call the page component with searchParams containing only token
    // Assert an error state or redirect is rendered
  });
});
```

## Implementation Details

### File: `components/views/DetailView.tsx`

This is a `'use client'` component.

**Props interface:**

```typescript
interface DetailViewProps {
  token: string;
  entityType: 'client' | 'company';
  entityId: string;
  entityName: string;
  entityInfo?: string; // e.g., email for clients, description for companies
  portalUrl?: string | null;
}
```

**Key behaviors:**

1. **Entity Header**: Display the entity name using a design system `Heading` component. Show additional info (email, company association) using `Body`. Optionally render an `Avatar` if available.

2. **Resource Tabs**: Render the `ResourceTabs` component (from section-06) passing `entityType` and `entityId`. ResourceTabs manages Notes, Tasks, and Files tabs internally.

3. **Bridge Breadcrumbs**: Use the `useBreadcrumbs` hook from `bridge/hooks.ts` to set breadcrumbs:
   - First item: `{ label: "App Name", onClick: navigateToOverview }` where `navigateToOverview` calls `router.push('/?token=...')` to go back to the overview list.
   - Second item: `{ label: entityName }` (no onClick, current location).

4. **Bridge Config**: Use `useBridgeConfig(portalUrl)` to configure the bridge on mount.

5. **Token Provider**: Wrap content in `TokenProvider` so child components (ResourceTabs and its children) can access the token via `useToken()`.

**Design system components used:**
- `Heading` for entity name
- `Body` for entity metadata (email, type label)
- `Avatar` for entity icon (optional)
- Layout achieved with flex/grid via Tailwind utility classes for spacing (design system does not provide a generic layout grid component)

**Navigation back to overview:**
- Import `useRouter` from `next/navigation`
- The first breadcrumb's `onClick` calls `router.push('/')` (the overview page). The token is already in the URL context since the app operates within the iframe.

### File: `app/detail/page.tsx`

This is an async server component for handling in-app navigation to the detail view.

**Key behaviors:**

1. **Extract query params**: Read `clientId` or `companyId` and `token` from `searchParams` (which is a Promise in Next.js 16).

2. **Validate params**: If neither `clientId` nor `companyId` is present, render an error state or redirect back to overview.

3. **Fetch entity data server-side**: Initialize the SDK using `assemblyApi` with the API key and token. Fetch the specific entity:
   - If `clientId` present: call `assembly.retrieveClient({ id: clientId })`
   - If `companyId` present: call `assembly.retrieveCompany({ id: companyId })`

4. **Render DetailView**: Pass the fetched entity data as props to `DetailView`:
   - `entityType`: `'client'` or `'company'`
   - `entityId`: the ID from query params
   - `entityName`: extracted from the fetched entity (e.g., `client.givenName + ' ' + client.familyName` or `company.name`)
   - `entityInfo`: secondary info like email
   - `token`: passed through for client-side API calls
   - `portalUrl`: fetch workspace to get portal URL for bridge config

5. **Dynamic rendering**: Export `const dynamic = 'force-dynamic'` since the page depends on query params and API calls.

**Pattern reference from existing code**: Follow the same pattern as `app/(home)/page.tsx` which uses `getSession()` to initialize SDK and fetch data server-side, then passes results to client components.

**SDK usage notes**:
- Import `assemblyApi` from `@assembly-js/node-sdk`
- Import `need` from `@/utils/need` for the API key check
- Before using `retrieveClient` or `retrieveCompany`, verify the exact parameter signature from the SDK types (both take `{ id: string }`)
- Entity response properties are all optional per SDK types; use type guards to safely extract name and info fields

### Bridge Integration Summary

The detail view sets up the bridge with two breadcrumb items. This creates a navigation trail in the Assembly dashboard header:

```
App Name > Client Name
```

The "App Name" breadcrumb is clickable and navigates back to the internal overview. The entity name breadcrumb is the current page and is not clickable.

The `ResourceTabs` component (section-06) is responsible for updating the primary CTA based on the active tab (e.g., "Add Note" when on the Notes tab, "Add Task" when on the Tasks tab). `DetailView` itself does not set a primary CTA -- that responsibility is delegated to ResourceTabs.

### Relevant Existing Files

- `/Users/neil/code/custom-apps/custom-app-base/bridge/hooks.ts` -- Contains `useBreadcrumbs`, `usePrimaryCta`, `useActionsMenu`, `useBridgeConfig` hooks
- `/Users/neil/code/custom-apps/custom-app-base/app/providers/TokenProvider.tsx` -- Contains `TokenProvider` and `useToken`
- `/Users/neil/code/custom-apps/custom-app-base/utils/session.ts` -- Contains `getSession` and `SessionData` type (will be extended in section-01)
- `/Users/neil/code/custom-apps/custom-app-base/utils/need.ts` -- Utility for required values
- `/Users/neil/code/custom-apps/custom-app-base/app/(home)/page.tsx` -- Reference pattern for server component with SDK calls