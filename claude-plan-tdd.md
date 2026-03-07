# TDD Plan: Custom App Base Improvement

Testing framework: **Vitest** + **@testing-library/react** for component tests, direct handler invocation for API route tests.

Setup: Create `vitest.config.ts` with Next.js plugin, configure `@testing-library/react` with custom render wrapper that includes TokenProvider.

---

## Section 1: Session & View Type Detection

### `utils/session.ts`

# Test: getSession returns viewType 'internal-overview' when token has internalUserId only
# Test: getSession returns viewType 'internal-detail' when token has internalUserId + clientId
# Test: getSession returns viewType 'internal-detail' when token has internalUserId + companyId
# Test: getSession returns viewType 'client' when token has clientId without internalUserId
# Test: getSession returns undefined/error when token is missing or invalid

### `app/page.tsx`

# Test: Home page renders InternalOverview when viewType is 'internal-overview'
# Test: Home page renders DetailView when viewType is 'internal-detail'
# Test: Home page renders ClientView when viewType is 'client'
# Test: Home page renders GettingStarted when token is missing
# Test: Home page renders MissingApiKey when API key is not configured

---

## Section 2: API Routes

### Common patterns across all routes

# Test: Route returns 401 when Authorization header is missing
# Test: Route returns 401 when Authorization header has invalid format
# Test: Route returns 500 with structured ApiError when SDK throws unexpected error

### `/api/clients/route.ts`

# Test: GET returns paginated client list
# Test: GET passes companyId filter to SDK when provided
# Test: GET passes limit and nextToken to SDK for pagination
# Test: GET returns empty list when no clients match

### `/api/companies/route.ts`

# Test: GET returns paginated company list
# Test: GET passes limit and nextToken to SDK for pagination

### `/api/notes/route.ts`

# Test: GET returns notes filtered by entityType and entityId
# Test: POST creates note with valid body and returns created note
# Test: POST returns 400 when required fields missing (zod validation)
# Test: PUT updates note content by id
# Test: PUT returns 400 when body fails zod validation
# Test: DELETE removes note by id
# Test: DELETE returns 404 when note id doesn't exist

### `/api/tasks/route.ts`

# Test: GET returns tasks, optionally filtered by clientId/companyId/status
# Test: POST creates task with valid body
# Test: POST returns 400 when required fields missing
# Test: PUT updates task status and fields by id
# Test: DELETE removes task by id

### `/api/files/route.ts`

# Test: GET returns file list
# Test: POST creates file from FormData body
# Test: POST returns 400 when file data is missing

---

## Section 3: SWR Data Fetching Hook

### `useApi`

# Test: useApi constructs URL with endpoint and query params
# Test: useApi includes Authorization header with token from context
# Test: useApi returns isLoading true while fetching
# Test: useApi returns data on successful fetch
# Test: useApi returns error on failed fetch
# Test: useApi mutate function triggers refetch

### `useApiMutation`

# Test: trigger sends POST with JSON body and Authorization header
# Test: trigger sends PUT with JSON body and Authorization header
# Test: trigger sends DELETE with Authorization header
# Test: isMutating is true during in-flight request
# Test: isMutating returns to false after request completes
# Test: successful mutation triggers SWR revalidation for related cache key
# Test: failed mutation parses ApiError from response

---

## Section 4: Internal Overview View

### `InternalOverview.tsx`

# Test: Renders client list tab by default
# Test: Switching to Companies tab fetches and renders company list
# Test: Clicking a client entity navigates to detail route with clientId
# Test: Clicking a company entity navigates to detail route with companyId
# Test: Shows Skeleton loading state while data is loading
# Test: Shows EmptyState when client list is empty
# Test: Sets bridge breadcrumbs on mount

### `EntityPicker.tsx`

# Test: Renders list of entities with name and details
# Test: Fires onClick callback with entity data when row clicked
# Test: Filters entities when search input changes

### `Pagination.tsx`

# Test: Renders Next button when nextToken is present
# Test: Does not render Next button when nextToken is absent (last page)
# Test: Calls onPageChange with nextToken when Next clicked

---

## Section 5: Detail View

### `DetailView.tsx`

# Test: Renders entity header with name and info
# Test: Renders ResourceTabs with correct entityType and entityId
# Test: Sets bridge breadcrumbs with app name and entity name
# Test: Bridge breadcrumb first item navigates back to overview on click

### `app/detail/page.tsx`

# Test: Extracts clientId from query params and fetches entity data
# Test: Extracts companyId from query params and fetches entity data
# Test: Returns error when neither clientId nor companyId provided

---

## Section 6: Resource Components

### `NotesList.tsx`

# Test: Renders list of notes with content preview, timestamp, author
# Test: Shows Skeleton loading state while fetching
# Test: Shows EmptyState when no notes exist
# Test: Edit button opens NoteForm with existing note data
# Test: Delete button calls mutation and refreshes list
# Test: Delete button is disabled while isMutating

### `NoteForm.tsx`

# Test: Renders TextArea and submit Button in create mode
# Test: Pre-fills TextArea with content in edit mode
# Test: Calls POST mutation on submit in create mode
# Test: Calls PUT mutation on submit in edit mode
# Test: Disables submit button while isMutating
# Test: Clears form after successful submission

### `TasksList.tsx`

# Test: Renders tasks with title, status Badge, and assignee
# Test: Status Badge uses correct color variant per status
# Test: Inline status Select triggers PUT mutation
# Test: Shows Skeleton loading state while fetching
# Test: Shows EmptyState when no tasks exist

### `TaskForm.tsx`

# Test: Renders Input for title, TextArea for description
# Test: Calls POST mutation on submit with form data
# Test: Disables submit button while isMutating

### `FilesList.tsx`

# Test: Renders file list with name, type, size, upload date
# Test: Upload button triggers file input
# Test: File selection triggers POST mutation with FormData
# Test: Shows Skeleton loading state while fetching

### `ResourceTabs.tsx`

# Test: Renders Notes, Tasks, Files tabs using design system Tabs
# Test: Switching tabs renders the correct resource component
# Test: Passes entityType and entityId to active resource component
# Test: Updates bridge CTA label based on active tab

---

## Section 7: Client View

### `ClientView.tsx`

# Test: Renders client profile header with name, email, company
# Test: Renders company info when company data available
# Test: Passes entityType='client' and entityId from session to ResourceTabs
# Test: Sets bridge breadcrumbs with app name only (no navigation trail)
# Test: Does not render delete actions on resource components (if restricted)

---

## Section 8: Examples Page

### `app/examples/page.tsx`

# Test: Renders all existing demo sections (RequestTester, HeaderControls, etc.)
# Test: Page is accessible and renders without errors
# Test: GettingStarted section renders when no token

---

## Section 9: Shared Utilities & Types

### `utils/types.ts`

# Test: ViewType union includes all three variants
# Test: SessionData interface matches expected shape
# Test: ApiError interface has error string and status number

### `EmptyState.tsx`

# Test: Renders icon, heading message, and description
# Test: Renders action button when provided
# Test: Action button fires onClick callback

---

## Section 10: AGENTS.md Rewrite

No automated tests. Manual review that:
# Check: AGENTS.md is under 150 lines
# Check: All six sections present (App Context, View Patterns, SDK Patterns, API Route Patterns, Bridge Patterns, Design System)
# Check: Code examples reference actual app files, not standalone snippets
