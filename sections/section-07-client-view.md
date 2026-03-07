Now I have all the context needed. Let me generate the section content.

# Section 7: Client View

## Overview

This section implements `ClientView.tsx`, the view shown when a client user opens the app from the Assembly client portal. The client view reuses the `ResourceTabs` component from section 06 but presents a simpler interface: the entity context is derived directly from the session (the token already identifies the client), there is no navigation trail in breadcrumbs, and some actions may be restricted compared to the internal detail view.

## Dependencies

- **Section 01 (Session and ViewType)**: Provides `SessionData` with `viewType` and `client`/`company` fields. The home page routes to `ClientView` when `viewType === 'client'`.
- **Section 06 (Resource Components)**: Provides `ResourceTabs` component that renders tabbed notes/tasks/files interface.
- **Section 03 (SWR Hooks)**: `useApi` and `useApiMutation` are used indirectly through `ResourceTabs` and its child components.
- **Section 09 (Shared Utilities)**: Provides `ViewType` and `SessionData` types, plus `EmptyState` component.

## Background Context

### How ClientView Gets Rendered

The home page server component (`app/page.tsx`, built in section 01) calls `getSession()` which decodes the token and determines the `viewType`. When the token contains a `clientId` but no `internalUserId`, the view type is `'client'`. The server component then renders `ClientView`, passing session data and token as props.

### Session Data Shape

The session object passed to `ClientView` includes:

- `session.client` -- the client entity with `id`, `givenName`, `familyName`, `email`, and related fields
- `session.company` -- optionally present if the client belongs to a company
- `session.workspace` -- the workspace context
- `session.viewType` -- will be `'client'`
- `token` -- the raw token string, passed separately for use by TokenProvider

### Bridge Hooks

The bridge hooks from `bridge/hooks.ts` allow setting header controls in the parent Assembly frame:

- `useBreadcrumbs(items)` -- sets breadcrumb navigation; items have `label` and optional `onClick`
- `usePrimaryCta(config)` -- sets primary CTA button with `label`, optional `icon`, and `onClick`
- `useBridgeConfig(portalUrl)` -- configures bridge allowed origins (called once, typically in a parent component)

### Design System

All UI must use `@assembly-js/design-system` components. Key components for ClientView:

- `Heading` -- for client name and section titles
- `Body` -- for metadata text (email, company name)
- `Avatar` -- for client avatar/initials
- `Icon` -- for decorative icons

Do not invent props on design system components. Verify available props in Storybook before use.

### Token Scoping

When a client user is viewing the app, the token automatically scopes all SDK API calls to that client's data. The API routes (section 02) use this token, so `ResourceTabs` and its children will automatically fetch only the client's own notes, tasks, and files without any extra filtering logic.

## Tests

**Test file**: `components/views/__tests__/ClientView.test.tsx`

Write tests using Vitest and `@testing-library/react`. Create a custom render wrapper that provides `TokenProvider` context with a mock token.

### Test: Renders client profile header with name, email, company

Render `ClientView` with session data containing a client with `givenName`, `familyName`, and `email`. Assert that the client's full name and email are visible in the document. This verifies the profile header section renders correctly.

### Test: Renders company info when company data available

Render `ClientView` with session data that includes both `client` and `company` fields. Assert that the company name appears in the rendered output. This verifies the optional company section displays when data is present.

### Test: Passes entityType='client' and entityId from session to ResourceTabs

Render `ClientView` and verify that `ResourceTabs` receives `entityType` as `'client'` and `entityId` matching `session.client.id`. Mock the `ResourceTabs` component to inspect its props, or verify the rendered output reflects the correct entity context.

### Test: Sets bridge breadcrumbs with app name only (no navigation trail)

Mock `useBreadcrumbs` from `bridge/hooks.ts`. Render `ClientView` and assert that `useBreadcrumbs` was called with a single breadcrumb item containing only the app label (no `onClick` handler, since there is no parent view to navigate back to).

### Test: Does not render delete actions on resource components (if restricted)

If the client view restricts certain actions (such as delete), verify that `ResourceTabs` receives the appropriate props to disable those actions (e.g., a `readOnly` or `allowDelete={false}` prop). Alternatively, verify that the rendered output does not include delete action buttons.

## Implementation

### File: `components/views/ClientView.tsx`

This is a `'use client'` component that receives session data and renders a client-facing view with profile information and resource tabs.

**Props interface:**

```typescript
interface ClientViewProps {
  session: SessionData;
  token: string;
}
```

**Component structure:**

1. **Bridge setup** -- Call `useBreadcrumbs` with a single item: `[{ label: "App Name" }]`. No `onClick` handler since the client has no parent view to navigate to. The app name can be derived from `session.workspace.name` or a static string.

2. **Client profile header** -- Display the client's name using `Heading`, email using `Body`, and optionally an `Avatar` component. Use a type guard to ensure `session.client` has the required fields before rendering.

3. **Company info section** -- Conditionally rendered when `session.company` is present. Show company name using `Body` or `Heading` with a smaller size variant.

4. **ResourceTabs** -- Render the `ResourceTabs` component (from section 06) passing:
   - `entityType` as `'client'`
   - `entityId` as `session.client.id`
   - Any restriction flags if the client view should limit available actions (e.g., `allowDelete={false}`)

**Key differences from `DetailView`:**

- No back navigation in breadcrumbs (client is already in their own context)
- Entity context is derived from `session.client` rather than from URL query params or token entity fields
- Potentially fewer actions available (no delete, limited task management)
- Simpler header -- just the app name, no navigation trail

**Type safety:** All SDK response properties are optional. Use type guard filters before accessing `session.client` properties like `id`, `givenName`, `familyName`, and `email`. If `session.client` is undefined or missing required fields, render an appropriate error or empty state.

### Integration with Home Page

The home page (`app/page.tsx`, from section 01) renders `ClientView` like this:

```typescript
// Inside the home page server component, after getSession():
if (session.viewType === 'client') {
  return (
    <TokenProvider token={token}>
      <ClientView session={session} token={token} />
    </TokenProvider>
  );
}
```

The `TokenProvider` wrapping is handled by the parent, so `ClientView` itself does not need to set up the token context. The `useApi` hook (used within `ResourceTabs` children) will read the token from `TokenProvider` via `useToken()`.

### File Paths Summary

- **New file**: `components/views/ClientView.tsx` -- the client view component
- **New file**: `components/views/__tests__/ClientView.test.tsx` -- tests for ClientView
- **Read-only dependency**: `bridge/hooks.ts` -- `useBreadcrumbs` hook
- **Read-only dependency**: `components/shared/ResourceTabs.tsx` -- reused tabbed resource interface (section 06)
- **Read-only dependency**: `utils/session.ts` -- `SessionData` type (section 01)
- **Read-only dependency**: `app/providers/TokenProvider.tsx` -- token context provider