I have all the context I need. Here is the section content:

# Section 4: Internal Overview View

## Overview

This section builds the `InternalOverview.tsx` view component -- the main screen an internal user sees when opening the app without a specific client/company context (i.e., `viewType === 'internal-overview'`). It also creates two reusable shared components: `EntityPicker.tsx` (entity list display with search) and `Pagination.tsx` (cursor-based navigation controls).

All three are client components (`'use client'`) that use design system components for rendering and the `useApi` SWR hook for data fetching.

## Dependencies

This section depends on:

- **section-01-session-viewtype**: The home page (`app/page.tsx`) must route to `InternalOverview` when `viewType === 'internal-overview'`, passing the session token as a prop.
- **section-03-swr-hooks**: The `useApi` hook from `hooks/useApi.ts` must exist, providing `{ data, error, isLoading, mutate }` for fetching from API routes. It reads the token from `TokenProvider` context and sends it as an `Authorization: Bearer <token>` header.

The API routes for `/api/clients` and `/api/companies` (section-02) must also be in place, returning paginated lists with `nextToken` for cursor-based pagination.

## Files to Create

| File | Purpose |
|------|---------|
| `components/views/InternalOverview.tsx` | Main overview view with client/company tabs |
| `components/shared/EntityPicker.tsx` | Reusable entity list with search filtering |
| `components/shared/Pagination.tsx` | Cursor-based pagination controls |
| `__tests__/components/views/InternalOverview.test.tsx` | Tests for InternalOverview |
| `__tests__/components/shared/EntityPicker.test.tsx` | Tests for EntityPicker |
| `__tests__/components/shared/Pagination.test.tsx` | Tests for Pagination |

## Design System Components Available

The `@assembly-js/design-system` package exports the following relevant components (verified from the package index). Do NOT use components not in this list:

- **`Heading`** - Section/page titles. Props: `size` (`'3xl'`, `'2xl'`, `'xl'`, etc.)
- **`Body`** - Body text. Props: `size` (`'lg'`, `'base'`, `'sm'`), `className`
- **`Button`** - Buttons. Props: `variant` (`'primary'`, `'secondary'`, `'text'`), `size` (`'sm'`, etc.), `label`
- **`Icon`** - Icons. Props: `icon` (string name like `'Search'`, `'Building'`, `'Profile'`, `'ChevronRight'`), `className`
- **`Input`** - Form inputs. Check Storybook for exact props before use.
- **`Search`** - Search input component. Check Storybook for exact props.
- **`Avatar`** - User/entity avatars
- **`Spinner`** - Loading spinner
- **`Tooltip`** - Tooltips

The design system does NOT export `Tabs`, `Skeleton`, `Table`, `Card`, `Badge`, `Dialog`, `Sheet`, `Select`, or `TextArea`. For tabbed interfaces, build a custom tab UI using `Button` components with active state styling, or use a simple HTML-based tab pattern with design system typography.

## Tests

Write tests in the project root `__tests__/` directory. The testing setup uses Vitest and `@testing-library/react`. Mock the `useApi` hook, `useRouter` from Next.js, and the bridge hooks.

### `__tests__/components/views/InternalOverview.test.tsx`

```typescript
/**
 * Test: Renders client list tab by default
 *   - Mock useApi to return a list of clients
 *   - Assert that client names are rendered
 *   - Assert "Clients" tab is visually active
 *
 * Test: Switching to Companies tab fetches and renders company list
 *   - Click "Companies" tab button
 *   - Assert useApi is called with '/api/companies' params
 *   - Assert company names are rendered
 *
 * Test: Clicking a client entity navigates to detail route with clientId
 *   - Click a client row
 *   - Assert router.push was called with '/detail?clientId=<id>&token=<token>'
 *
 * Test: Clicking a company entity navigates to detail route with companyId
 *   - Click a company row
 *   - Assert router.push was called with '/detail?companyId=<id>&token=<token>'
 *
 * Test: Shows loading state (Spinner) while data is loading
 *   - Mock useApi to return { isLoading: true, data: undefined }
 *   - Assert Spinner or loading indicator is rendered
 *
 * Test: Shows EmptyState when client list is empty
 *   - Mock useApi to return { data: { items: [] }, isLoading: false }
 *   - Assert empty state message is rendered
 *
 * Test: Sets bridge breadcrumbs on mount
 *   - Assert useBreadcrumbs was called with [{ label: "App Name" }]
 */
```

### `__tests__/components/shared/EntityPicker.test.tsx`

```typescript
/**
 * Test: Renders list of entities with name and details
 *   - Pass an array of entity objects
 *   - Assert each entity's name is rendered via Body component
 *
 * Test: Fires onClick callback with entity data when row clicked
 *   - Click an entity row
 *   - Assert the onClick handler received the correct entity object
 *
 * Test: Filters entities when search input changes
 *   - Type into the search input
 *   - Assert only matching entities are visible
 */
```

### `__tests__/components/shared/Pagination.test.tsx`

```typescript
/**
 * Test: Renders Next button when nextToken is present
 *   - Pass nextToken="abc123"
 *   - Assert a "Next" button is rendered
 *
 * Test: Does not render Next button when nextToken is absent (last page)
 *   - Pass nextToken={undefined}
 *   - Assert no "Next" button exists
 *
 * Test: Calls onPageChange with nextToken when Next clicked
 *   - Click the Next button
 *   - Assert onPageChange was called with "abc123"
 */
```

## Implementation Details

### `components/shared/Pagination.tsx`

A simple, stateless component for cursor-based pagination.

**Props:**

```typescript
interface PaginationProps {
  nextToken?: string;
  onPageChange: (nextToken: string) => void;
}
```

**Behavior:**
- Renders a "Next" `Button` (design system, variant `'secondary'`) only when `nextToken` is defined
- Clicking the button calls `onPageChange(nextToken)`
- The component does not track history of previous pages (cursor-based pagination is forward-only in this implementation; going "back" would require maintaining a token stack, which is out of scope for this example app)
- Wraps the button in a flex container aligned to the end

### `components/shared/EntityPicker.tsx`

A reusable entity list component with client-side search filtering.

**Props:**

```typescript
interface Entity {
  id: string;
  name: string;
  detail?: string;  // e.g., email for clients, or description for companies
}

interface EntityPickerProps {
  entities: Entity[];
  onSelect: (entity: Entity) => void;
  isLoading?: boolean;
}
```

**Behavior:**
- Renders a search `Input` (design system) at the top for client-side filtering by name
- Below the input, renders each entity as a clickable row using a `<div>` with hover styling
- Each row displays entity name via `Body` (size `'base'`) and detail via `Body` (size `'sm'`, muted color)
- Optionally show an `Avatar` or `Icon` (`'Profile'` for clients, `'Building'` for companies) at the start of each row -- this can be passed as a prop or determined by the parent
- Clicking a row calls `onSelect(entity)`
- When `isLoading` is true, render a `Spinner` component instead of the list
- When `entities` is empty and not loading, render an `EmptyState` component (from section-09) or a simple "No results" message using `Body`
- The search filter is case-insensitive and matches against the entity `name` field
- Maintain search state internally via `useState`

### `components/views/InternalOverview.tsx`

The main overview view for internal users.

**Props:**

```typescript
interface InternalOverviewProps {
  token: string;
}
```

**Behavior:**

1. **Tab state**: Maintain an `activeTab` state (`'clients' | 'companies'`), defaulting to `'clients'`.

2. **Data fetching**: Use the `useApi` hook to fetch data based on the active tab:
   - When `activeTab === 'clients'`: call `useApi<ClientListResponse>('/api/clients', { limit: '20', ...(nextToken ? { nextToken } : {}) })`
   - When `activeTab === 'companies'`: call `useApi<CompanyListResponse>('/api/companies', { limit: '20', ...(nextToken ? { nextToken } : {}) })`

3. **Pagination state**: Maintain a `nextTokenState` via `useState<string | undefined>()`. Reset it to `undefined` when the active tab changes. Pass the `nextToken` from the API response to the `Pagination` component. When `onPageChange` fires, update the state to trigger a new fetch.

4. **Tab UI**: Since the design system does not have a `Tabs` component, build a simple tab bar using two `Button` components:
   - Active tab button uses `variant="primary"`
   - Inactive tab button uses `variant="secondary"` or `variant="text"`
   - Wrap in a flex container with a bottom border for visual separation

5. **Entity list**: Transform API response items into the `Entity` shape expected by `EntityPicker`:
   - For clients: `{ id: client.id, name: client.givenName + ' ' + client.familyName, detail: client.email }`
   - For companies: `{ id: company.id, name: company.name, detail: undefined }`
   - Filter out items where `id` or `name` is missing (SDK response properties are optional)

6. **Navigation**: When `EntityPicker` fires `onSelect`, navigate to the detail view:
   - Use `useRouter()` from `next/navigation`
   - For clients: `router.push('/detail?clientId=' + entity.id + '&token=' + token)`
   - For companies: `router.push('/detail?companyId=' + entity.id + '&token=' + token)`

7. **Bridge breadcrumbs**: Call `useBreadcrumbs([{ label: 'Custom App' }])` on mount. No CTAs or actions menu on the overview (those belong on detail views).

8. **Layout**: Use the `Container` component from `components/Container.tsx` (already exists) as a wrapper. Place a `Heading` (size `'xl'`) at the top, then the tab buttons, then `EntityPicker`, then `Pagination`.

### Response Type Assumptions

The API routes (section-02) return paginated responses. The expected shape is:

```typescript
interface PaginatedResponse<T> {
  items: T[];
  nextToken?: string;
}
```

Where `T` is the SDK client or company type. The `useApi` hook returns `{ data, error, isLoading, mutate }` where `data` is typed as the response shape.

### Bridge Integration

The bridge hooks are imported from `@/bridge/hooks`:

```typescript
import { useBreadcrumbs } from '@/bridge/hooks';
```

The `useBreadcrumbs` hook accepts an array of `{ label: string, onClick?: () => void }` objects. It automatically clears breadcrumbs on unmount.

For `InternalOverview`, set breadcrumbs to just the app name with no click handler (since this is the root view):

```typescript
useBreadcrumbs([{ label: 'Custom App' }]);
```

### Key Considerations

- **SDK type optionality**: All SDK response properties are optional. Always filter entities to remove any that lack a valid `id` or display name before passing to `EntityPicker`. Use a type guard like `.filter((item): item is Required<Pick<typeof item, 'id' | 'givenName'>> & typeof item => Boolean(item.id && item.givenName))` for clients.
- **Tab switching resets pagination**: When switching between Clients and Companies tabs, reset `nextTokenState` to `undefined` so the fetch starts from the beginning.
- **Token forwarding**: The token is accessed from `TokenProvider` context inside `useApi`. The `InternalOverview` component receives it as a prop primarily for constructing navigation URLs. It does not need to pass the token to `useApi` explicitly.
- **Loading states**: Use the design system `Spinner` component for loading indicators. The design system does not have a `Skeleton` component.