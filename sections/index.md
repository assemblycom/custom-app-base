<!-- PROJECT_CONFIG
runtime: typescript-npm
test_command: npx vitest run
END_PROJECT_CONFIG -->

<!-- SECTION_MANIFEST
section-01-session-viewtype
section-02-api-routes
section-03-swr-hooks
section-04-internal-overview
section-05-detail-view
section-06-resource-components
section-07-client-view
section-08-examples-page
section-09-shared-utilities
section-10-agents-rewrite
END_MANIFEST -->

# Implementation Sections Index

## Dependency Graph

| Section | Depends On | Blocks | Parallelizable |
|---------|------------|--------|----------------|
| section-01-session-viewtype | - | 02, 04, 05, 07 | Yes |
| section-02-api-routes | 01 | 03, 04, 05, 06, 07 | No |
| section-03-swr-hooks | 02 | 04, 05, 06, 07 | No |
| section-04-internal-overview | 01, 03 | - | Yes |
| section-05-detail-view | 01, 03 | 06 | Yes |
| section-06-resource-components | 03, 05 | 07 | No |
| section-07-client-view | 06 | - | No |
| section-08-examples-page | - | - | Yes |
| section-09-shared-utilities | - | - | Yes |
| section-10-agents-rewrite | - | - | Yes |

## Execution Order

1. section-01-session-viewtype, section-08-examples-page, section-09-shared-utilities (parallel - no dependencies)
2. section-02-api-routes (after 01)
3. section-03-swr-hooks (after 02)
4. section-04-internal-overview, section-05-detail-view (parallel after 03)
5. section-06-resource-components (after 05)
6. section-07-client-view (after 06)
7. section-10-agents-rewrite (independent, can run anytime)

## Section Summaries

### section-01-session-viewtype
Extend `utils/session.ts` with `ViewType` detection. Update `app/page.tsx` to route to the correct view component based on token context.

### section-02-api-routes
Create API routes for clients, companies, notes, tasks, and files. Implement token extraction from Authorization header, zod input validation, structured error handling, and SDK integration.

### section-03-swr-hooks
Create `useApi` and `useApiMutation` hooks for consistent data fetching and mutations. Centralize Authorization header injection and SWR cache management.

### section-04-internal-overview
Build `InternalOverview.tsx` with client/company tabs, `EntityPicker.tsx` for entity list display, and `Pagination.tsx` for cursor-based navigation. Wire up bridge breadcrumbs.

### section-05-detail-view
Build `DetailView.tsx` with entity header and tabbed resource browser. Create `app/detail/page.tsx` for in-app navigation. Wire up bridge breadcrumbs with back navigation.

### section-06-resource-components
Build `NotesList`, `NoteForm`, `TasksList`, `TaskForm`, `FilesList`, and `ResourceTabs` components. Full CRUD operations using design system components, SWR mutations, and react-hook-form.

### section-07-client-view
Build `ClientView.tsx` that derives entity context from session and renders ResourceTabs. Simpler bridge integration (no navigation trail).

### section-08-examples-page
Move existing demo sections from `app/(home)/sections/` to `app/examples/sections/`. Create `app/examples/page.tsx`. Remove `(home)` route group.

### section-09-shared-utilities
Create `utils/types.ts` with ViewType, SessionData, ApiError types. Build `EmptyState.tsx` component. Establish loading state patterns with Skeleton.

### section-10-agents-rewrite
Rewrite AGENTS.md with concise sections: App Context, View Patterns, SDK Patterns, API Route Patterns, Bridge Patterns, Design System. Under 150 lines.
