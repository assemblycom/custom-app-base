Now I have all the context needed. Let me generate the section content.

# Section 9: Shared Utilities and Types

## Overview

This section creates shared TypeScript types, the `EmptyState` component, and establishes loading state patterns using `Skeleton` elements. These are foundational pieces used across all views and resource components. This section has no dependencies and can be implemented in parallel with section-01 and section-08.

## Files to Create

- `/Users/neil/code/custom-apps/custom-app-base/utils/types.ts` -- Shared TypeScript types
- `/Users/neil/code/custom-apps/custom-app-base/components/shared/EmptyState.tsx` -- Empty state placeholder component
- `/Users/neil/code/custom-apps/custom-app-base/__tests__/utils/types.test.ts` -- Type tests
- `/Users/neil/code/custom-apps/custom-app-base/__tests__/components/shared/EmptyState.test.tsx` -- EmptyState component tests

## Background

The app is a Next.js 16 application running as an iframe embedded in the Assembly dashboard. Multiple views (internal overview, detail, client) share common types and UI patterns. Centralizing these prevents duplication and ensures consistency.

The `@assembly-js/design-system` package exports: `Avatar`, `Body`, `Heading`, `Button`, `Icon`, `Input`, `Checkbox`, `Chip`, `Search`, `Spinner`, `Status`, `Tag`, `TextLink`, `Toggle`, `Radio`, `Tooltip`, `Callout`, `Toolbar`, `Breadcrumbs`, `UserCompanySelector`. Note that there is **no** `Skeleton` component in the design system -- loading states should be built using plain `div` elements with CSS animation or the `Spinner` component from the design system.

The SDK types from `@assembly-js/node-sdk` should be imported using `import type` syntax to avoid pulling runtime code into client bundles.

## Tests First

### `__tests__/utils/types.test.ts`

These tests validate the type definitions compile correctly and the exported types have the expected shape. Use `expectTypeOf` from vitest or compile-time assertions.

```typescript
// Test: ViewType union includes all three variants
// Verify that 'internal-overview', 'internal-detail', and 'client' are all assignable to ViewType

// Test: SessionData interface matches expected shape
// Verify SessionData has required fields: viewType (ViewType), workspace, token (string)
// Verify SessionData has optional fields: client, company, internalUser

// Test: ApiError interface has error string and status number
// Verify ApiError has 'error' (string) and 'status' (number) properties
```

### `__tests__/components/shared/EmptyState.test.tsx`

These tests validate the EmptyState component renders correctly with various prop combinations. Uses `@testing-library/react`.

```typescript
// Test: Renders icon, heading message, and description
// Render EmptyState with icon name, message, and description props
// Assert all three elements are present in the document

// Test: Renders action button when provided
// Render EmptyState with an actionLabel and onAction callback
// Assert a Button with the action label text is rendered

// Test: Action button fires onClick callback
// Render EmptyState with onAction callback
// Click the action button
// Assert the callback was called
```

Note: Vitest and `@testing-library/react` are not currently in `package.json` devDependencies. The test runner (`npx vitest run`) will need vitest installed. A `vitest.config.ts` should be created at the project root if it does not already exist, configured for the Next.js/React environment.

## Implementation Details

### `utils/types.ts`

Define three exports:

**`ViewType`** -- A union type representing the three possible viewing contexts:
- `'internal-overview'` -- Internal user with no specific client/company context
- `'internal-detail'` -- Internal user viewing a specific client or company
- `'client'` -- Client user accessing from the client portal

**`SessionData`** -- An interface describing the session object returned by `getSession()`. This mirrors and extends the existing return type from `utils/session.ts` (which currently uses `Awaited<ReturnType<typeof getSession>>`) by adding the `viewType` field and the `token` string. The entity fields (`client`, `company`, `internalUser`) are optional because their presence depends on the token context. The `workspace` field is always present.

Use `import type` for any SDK types referenced (e.g., the return types of `assembly.retrieveClient`, `assembly.retrieveCompany`, etc.). Since the existing `utils/session.ts` already defines `SessionData` as `Awaited<ReturnType<typeof getSession>>`, the new `utils/types.ts` should define the extended interface that includes `viewType` and `token`, and section-01 will update `session.ts` to conform to this type.

**`ApiError`** -- A simple interface with two fields: `error` (string message) and `status` (number HTTP status code). Used by API routes (section-02) for consistent error responses and by the `useApiMutation` hook (section-03) for error parsing.

### `components/shared/EmptyState.tsx`

A `'use client'` component that renders a centered placeholder when a resource list has no items. It is used by `NotesList`, `TasksList`, and `FilesList` (section-06) when their data arrays are empty.

**Props:**
- `icon` -- string, the name of an icon from the design system `Icon` component (e.g., `'Comment'`, `'Checklist'`, `'File'`)
- `message` -- string, the primary heading text (e.g., "No notes yet")
- `description` -- string, secondary body text explaining what to do
- `actionLabel` -- optional string, text for a call-to-action button (e.g., "Create your first note")
- `onAction` -- optional callback, fired when the action button is clicked

**Component structure:**
- Outer `div` with flexbox centering and padding
- Design system `Icon` component with the provided icon name
- Design system `Heading` for the message
- Design system `Body` for the description
- Conditionally rendered design system `Button` when `actionLabel` and `onAction` are provided

Verify the `Icon` component's props before implementation. Based on the design system, Icon components are imported individually by name (e.g., `import { Comment } from '@assembly-js/design-system'`). Check whether the design system has a generic `Icon` component that accepts a name prop, or if icons must be imported individually. The existing `DesignShowcase.tsx` imports `Icon` from the design system -- follow that pattern.

### Loading State Patterns

Since the design system does not export a `Skeleton` component, establish a loading pattern for resource lists:

- Use the design system `Spinner` component for simple loading indicators
- For content-shaped loading placeholders, create simple animated `div` elements with Tailwind's `animate-pulse` class and gray backgrounds that approximate the shape of list items
- Each resource component (built in section-06) handles its own loading state inline, checking the `isLoading` return value from the `useApi` hook (section-03)

Document this pattern in the EmptyState file or in a comment block in `utils/types.ts` so other sections can follow it consistently. The pattern is:

```typescript
// Loading pattern for resource lists:
// if (isLoading) return <LoadingPlaceholder />
// if (!data?.length) return <EmptyState ... />
// return <ActualList data={data} />
```

Where `LoadingPlaceholder` is a few `div` elements with `className="animate-pulse bg-gray-200 rounded h-16 mb-2"` to approximate list item shapes, or the design system `Spinner` for simpler cases.

## Dependencies and Consumers

This section has **no dependencies** on other sections.

The following sections consume these utilities:
- **Section 01** (session/viewtype) -- uses `ViewType` and `SessionData` types
- **Section 02** (API routes) -- uses `ApiError` type for error responses
- **Section 03** (SWR hooks) -- uses `ApiError` type for error parsing
- **Section 06** (resource components) -- uses `EmptyState` component
- **Section 04, 05, 07** (view components) -- use `SessionData` and `ViewType` types