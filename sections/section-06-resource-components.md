I now have all the context needed to write this section. Let me produce the content.

# Section 6: Resource Components

## Overview

This section builds the resource CRUD components that display and manage notes, tasks, and files for a given entity (client or company). These components are used by both the `DetailView` (section 05) and `ClientView` (section 07).

**Files to create:**
- `/Users/neil/code/custom-apps/custom-app-base/components/resources/NotesList.tsx`
- `/Users/neil/code/custom-apps/custom-app-base/components/resources/NoteForm.tsx`
- `/Users/neil/code/custom-apps/custom-app-base/components/resources/TasksList.tsx`
- `/Users/neil/code/custom-apps/custom-app-base/components/resources/TaskForm.tsx`
- `/Users/neil/code/custom-apps/custom-app-base/components/resources/FilesList.tsx`
- `/Users/neil/code/custom-apps/custom-app-base/components/shared/ResourceTabs.tsx`

**Test files to create:**
- `/Users/neil/code/custom-apps/custom-app-base/components/resources/__tests__/NotesList.test.tsx`
- `/Users/neil/code/custom-apps/custom-app-base/components/resources/__tests__/NoteForm.test.tsx`
- `/Users/neil/code/custom-apps/custom-app-base/components/resources/__tests__/TasksList.test.tsx`
- `/Users/neil/code/custom-apps/custom-app-base/components/resources/__tests__/TaskForm.test.tsx`
- `/Users/neil/code/custom-apps/custom-app-base/components/resources/__tests__/FilesList.test.tsx`
- `/Users/neil/code/custom-apps/custom-app-base/components/shared/__tests__/ResourceTabs.test.tsx`

## Dependencies

- **Section 03 (SWR Hooks)**: `useApi` and `useApiMutation` from `/Users/neil/code/custom-apps/custom-app-base/hooks/useApi.ts` must exist. These hooks handle Authorization header injection, SWR caching, and mutation state.
- **Section 05 (Detail View)**: `DetailView.tsx` renders `ResourceTabs`, which wraps these resource components.
- **Section 09 (Shared Utilities)**: `EmptyState` from `/Users/neil/code/custom-apps/custom-app-base/components/shared/EmptyState.tsx` is used for empty list states.
- **Section 02 (API Routes)**: API routes at `/api/notes`, `/api/tasks`, `/api/files` must exist.

## Design System Components Available

The `@assembly-js/design-system` package exports these components relevant to this section:

- **`Button`** -- props: `label` (required string), `variant`, `size`, `loading`, `prefixIcon`, `suffixIcon`, `onClick`, `disabled`
- **`IconButton`** -- props: `icon` (required IconType), `label`, `variant`, `size`, `onClick`, `disabled`
- **`Body`** -- props: `children`, `tag` ('p'|'div'|'span'), `size` ('xs'|'sm'|'base'|'lg'), `className`
- **`Heading`** -- props: `children`, `tag` ('h1'-'h6'|'span'), `size` ('3xs'-'3xl'), `className`
- **`Icon`** -- props: `icon` (required IconType), plus SVG props
- **`Input`** -- extends `InputHTMLAttributes<HTMLInputElement>`, adds `error`, `label`, `containerClassName`, `errorClassName`, `labelClassName`
- **`Textarea`** -- extends `TextareaHTMLAttributes<HTMLTextAreaElement>`, adds `error`, `label`, `containerClassName`, `errorClassName`, `labelClassName`
- **`Status`** -- props: `label` (required), `status` ('info'|'success'|'warning'|'error'|'neutral'|'highlight'), `showIcon`, `icon`
- **`Spinner`** -- loading indicator
- **`Avatar`** -- props: `size`, `variant` ('circle'|'rounded'), plus either `text` or `src`+`alt`
- **`Tooltip`** -- tooltip wrapper

The design system does NOT export `Tabs`, `Dialog`, `Sheet`, `Table`, `Select`, `Skeleton`, `Card`, or `Badge`. For tabs, use `@radix-ui/react-tabs` (already in dependencies). For dialogs, use `@radix-ui/react-dialog`. For select dropdowns, use `@radix-ui/react-select`. For loading states, use the `Spinner` component or build simple skeleton divs with Tailwind `animate-pulse`. For status indicators, use the `Status` component (not `Badge`).

Available icon names include: `Plus`, `Edit`, `Trash`, `File`, `Upload`, `Download`, `Check`, `Close`, `ChevronRight`, `ChevronLeft`, `Tasks`, `Message`, `Comment`, `Calendar`, `Attachment`, among many others.

## SDK Method Signatures

These are the exact SDK method signatures that the API routes (section 02) wrap. Understanding them helps clarify what request/response shapes the client components work with.

### Notes

- **`listNotes({ entityType?, entityId?, limit?, nextToken? })`** -- returns `{ data?: Array<{ id?, title?, content?, createdAt?, creatorId?, entityId?, entityType?, updatedAt? }>, nextToken? }`
- **`createNote({ requestBody: { entityType, entityId, title, content? } })`** -- returns single note object
- **`updateNote({ id, requestBody: { title?, content? } })`** -- returns single note object
- **`deleteNote({ id })`** -- returns `{ id?, deleted?, object? }`

### Tasks

- **`retrieveTasks({ limit?, nextToken?, status?, clientId?, companyId?, ... })`** -- returns `{ data?: Array<{ id?, name?, description?, status?, clientId?, companyId?, createdDate?, dueDate?, ... }>, nextToken? }`
- **`createTask({ requestBody: { name?, description?, status?, clientId?, companyId?, dueDate?, ... } })`** -- returns single task object
- **`updateTask({ id, requestBody: { name?, description?, status?, ... } })`** -- returns single task object
- **`deleteTask({ id })`** -- returns `{ id?, deleted?, object? }`

Task status values: `'todo'`, `'inProgress'`, `'completed'`

### Files

- **`listFiles({ channelId, path?, nextToken?, limit? })`** -- returns `{ data?: Array<{ id?, name?, path?, channelId?, createdAt?, updatedAt?, object? }>, nextToken? }`
- **`createFile({ fileType, requestBody: { path, channelId, linkUrl? } })`** -- returns single file object with `downloadUrl`, `size`, `status`, etc.

## Tests (Write First)

### NotesList Tests

File: `/Users/neil/code/custom-apps/custom-app-base/components/resources/__tests__/NotesList.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest';

/**
 * Test suite for NotesList component.
 * Mock useApi to return controlled data; mock useApiMutation for delete actions.
 * Wrap renders in TokenProvider with a test token.
 */

describe('NotesList', () => {
  // Test: Renders list of notes with content preview, timestamp, author
  // - Mock useApi to return array of notes with title, content, createdAt, creatorId
  // - Assert Body elements contain note title and truncated content
  // - Assert timestamps are formatted (use date-fns)

  // Test: Shows loading state (Spinner or animate-pulse divs) while fetching
  // - Mock useApi to return isLoading: true
  // - Assert loading indicator is present

  // Test: Shows EmptyState when no notes exist
  // - Mock useApi to return empty data array
  // - Assert EmptyState component renders with appropriate message

  // Test: Edit button opens NoteForm with existing note data
  // - Mock useApi to return one note
  // - Click the edit IconButton
  // - Assert NoteForm renders with pre-filled content

  // Test: Delete button calls mutation and refreshes list
  // - Mock useApiMutation trigger
  // - Click delete IconButton
  // - Assert trigger called with ('DELETE', undefined) and correct endpoint URL including id
  // - Assert mutate was called after deletion

  // Test: Delete button is disabled while isMutating
  // - Mock useApiMutation with isMutating: true
  // - Assert delete button has disabled attribute
});
```

### NoteForm Tests

File: `/Users/neil/code/custom-apps/custom-app-base/components/resources/__tests__/NoteForm.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest';

/**
 * Test suite for NoteForm component.
 * Mock useApiMutation for form submission.
 * Use react-hook-form internally.
 */

describe('NoteForm', () => {
  // Test: Renders Input for title, Textarea for content, and submit Button in create mode
  // - Render NoteForm without existing note prop
  // - Assert Input with label "Title" and Textarea with label "Content" are present
  // - Assert Button with label "Create Note" is present

  // Test: Pre-fills fields with existing data in edit mode
  // - Render NoteForm with note prop { id, title, content }
  // - Assert Input value matches note.title
  // - Assert Textarea value matches note.content

  // Test: Calls POST mutation on submit in create mode
  // - Fill title and content, submit form
  // - Assert trigger called with 'POST' and body containing { entityType, entityId, title, content }

  // Test: Calls PUT mutation on submit in edit mode
  // - Render with existing note, change content, submit
  // - Assert trigger called with 'PUT' and body containing { id, title, content }

  // Test: Disables submit button while isMutating
  // - Mock isMutating: true
  // - Assert submit Button has loading prop or disabled state

  // Test: Clears form and calls onClose after successful submission
  // - Submit form, trigger resolves
  // - Assert onClose callback was called
});
```

### TasksList Tests

File: `/Users/neil/code/custom-apps/custom-app-base/components/resources/__tests__/TasksList.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest';

describe('TasksList', () => {
  // Test: Renders tasks with title (name), status indicator, and date
  // - Mock useApi to return tasks with name, status, createdDate
  // - Assert Body elements contain task name
  // - Assert Status component renders with correct label/status mapping

  // Test: Status indicator uses correct variant per status
  // - 'todo' -> status='neutral', 'inProgress' -> status='warning', 'completed' -> status='success'

  // Test: Inline status select triggers PUT mutation
  // - Render tasks, change status via Radix Select on a task row
  // - Assert trigger called with 'PUT' and body { id, status: newValue }

  // Test: Shows loading state while fetching
  // - Mock useApi with isLoading: true

  // Test: Shows EmptyState when no tasks exist
  // - Mock useApi with empty data
});
```

### TaskForm Tests

File: `/Users/neil/code/custom-apps/custom-app-base/components/resources/__tests__/TaskForm.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest';

describe('TaskForm', () => {
  // Test: Renders Input for name, Textarea for description
  // - Assert Input with label "Task Name" present
  // - Assert Textarea with label "Description" present

  // Test: Calls POST mutation on submit with form data
  // - Fill name and description, submit
  // - Assert trigger called with 'POST' and body containing { name, description, entityId-related fields }

  // Test: Disables submit button while isMutating
});
```

### FilesList Tests

File: `/Users/neil/code/custom-apps/custom-app-base/components/resources/__tests__/FilesList.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest';

describe('FilesList', () => {
  // Test: Renders file list with name, type/object, upload date
  // - Mock useApi to return files with name, object, createdAt
  // - Assert each file row shows file name and formatted date

  // Test: Upload button triggers hidden file input
  // - Click upload Button
  // - Assert hidden input[type=file] click was triggered

  // Test: File selection triggers POST mutation with FormData
  // - Simulate file input change event
  // - Assert trigger called with 'POST' and appropriate body

  // Test: Shows loading state while fetching
  // - Mock useApi with isLoading: true
});
```

### ResourceTabs Tests

File: `/Users/neil/code/custom-apps/custom-app-base/components/shared/__tests__/ResourceTabs.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest';

describe('ResourceTabs', () => {
  // Test: Renders Notes, Tasks, Files tabs using Radix Tabs
  // - Assert three tab triggers with text "Notes", "Tasks", "Files"

  // Test: Switching tabs renders the correct resource component
  // - Click "Tasks" tab, assert TasksList is rendered
  // - Click "Files" tab, assert FilesList is rendered

  // Test: Passes entityType and entityId to active resource component
  // - Render with entityType='client' and entityId='abc'
  // - Assert the active resource component receives these props

  // Test: Updates bridge CTA label based on active tab
  // - Mock usePrimaryCta
  // - On Notes tab, assert CTA label is "Add Note"
  // - Switch to Tasks tab, assert CTA label is "Add Task"
  // - Switch to Files tab, assert CTA label is "Upload File"
});
```

## Implementation Details

### NotesList.tsx

File: `/Users/neil/code/custom-apps/custom-app-base/components/resources/NotesList.tsx`

This is a `'use client'` component that displays a list of notes for a given entity and provides edit/delete actions.

**Props:**

```typescript
interface NotesListProps {
  entityType: 'client' | 'company';
  entityId: string;
}
```

**Behavior:**

- Fetches notes using `useApi<NotesResponse>('/api/notes', { entityType, entityId })` where `NotesResponse` matches the shape `{ data?: Array<NoteItem>, nextToken?: string }`.
- Define a local `NoteItem` type with the fields: `id`, `title`, `content`, `createdAt`, `creatorId`, `entityId`, `entityType`, `updatedAt`. All optional per SDK conventions.
- Filter the response data using a type guard: `data?.filter((n): n is NoteItem & { id: string; title: string } => !!n.id && !!n.title)` to ensure only valid notes are rendered.
- Each note row renders: `Heading` (size `'2xs'`) for the title, `Body` (size `'sm'`) for a truncated content preview (strip HTML, limit to ~100 chars), `Body` (size `'xs'`) for formatted timestamp using `date-fns` `format` or `formatDistanceToNow`.
- Each note row has an `IconButton` with `icon="Edit"` and an `IconButton` with `icon="Trash"` for actions.
- Clicking Edit opens a `NoteForm` in a Radix Dialog (`@radix-ui/react-dialog`) pre-filled with the note data.
- Clicking Delete calls `useApiMutation('/api/notes').trigger('DELETE', { id: note.id })` (pass id as query param or in body depending on the API route design from section 02). After success, call `mutate()` from `useApi` to refresh the list.
- Maintain local state `editingNote` (the note being edited, or null) and `showCreateForm` (boolean).
- When `isLoading` is true, render placeholder divs with `className="animate-pulse bg-gray-200 rounded h-16 mb-2"` (3-4 of them).
- When data is empty (after loading), render the `EmptyState` component with icon `"Message"`, heading `"No notes yet"`, description text, and an action button labeled `"Add Note"`.

### NoteForm.tsx

File: `/Users/neil/code/custom-apps/custom-app-base/components/resources/NoteForm.tsx`

A `'use client'` form component for creating or editing notes. Rendered inside a Radix Dialog.

**Props:**

```typescript
interface NoteFormProps {
  entityType: 'client' | 'company';
  entityId: string;
  note?: { id: string; title: string; content?: string }; // undefined = create mode
  onClose: () => void;
  onSuccess: () => void; // called after successful save, triggers mutate()
}
```

**Behavior:**

- Uses `react-hook-form` with `useForm<{ title: string; content: string }>()`.
- In edit mode, pass `defaultValues: { title: note.title, content: note.content ?? '' }`.
- Renders design system `Input` with `label="Title"` registered via `{...register('title', { required: 'Title is required' })}`. Show `error={errors.title?.message}` prop.
- Renders design system `Textarea` with `label="Content"` registered via `{...register('content')}`.
- Renders design system `Button` with `label={note ? 'Update Note' : 'Create Note'}` and `loading={isMutating}`.
- Renders a cancel `Button` with `variant="secondary"` and `label="Cancel"` that calls `onClose`.
- On submit: if create mode, call `trigger('POST', { entityType, entityId, title, content })`. If edit mode, call `trigger('PUT', { id: note.id, title, content })`.
- The mutation endpoint is `/api/notes`.
- On success, call `onSuccess()` then `onClose()`.
- On error, display the error message from the mutation hook near the form.

### TasksList.tsx

File: `/Users/neil/code/custom-apps/custom-app-base/components/resources/TasksList.tsx`

A `'use client'` component displaying tasks with inline status management.

**Props:**

```typescript
interface TasksListProps {
  entityType: 'client' | 'company';
  entityId: string;
}
```

**Behavior:**

- Fetches tasks using `useApi<TasksResponse>('/api/tasks', { [entityType === 'client' ? 'clientId' : 'companyId']: entityId })`.
- Define a local `TaskItem` type matching the SDK response fields: `id`, `name`, `description`, `status`, `createdDate`, `dueDate`, `clientId`, `companyId`.
- Filter tasks with type guard ensuring `id` and `name` are present.
- Each task row shows: `Body` for task name, `Status` component for status (map task status to Status props: `'todo'` -> `{ label: 'To Do', status: 'neutral' }`, `'inProgress'` -> `{ label: 'In Progress', status: 'warning' }`, `'completed'` -> `{ label: 'Completed', status: 'success' }`).
- Inline status change: use a Radix Select (`@radix-ui/react-select`) dropdown on each task row with the three status options. On value change, call `useApiMutation('/api/tasks').trigger('PUT', { id: task.id, status: newStatus })` and then `mutate()`.
- Delete action via `IconButton` with `icon="Trash"`.
- Loading state: animated pulse placeholder divs.
- Empty state: `EmptyState` with icon `"Tasks"`, heading `"No tasks yet"`.

### TaskForm.tsx

File: `/Users/neil/code/custom-apps/custom-app-base/components/resources/TaskForm.tsx`

A `'use client'` form for creating tasks. Rendered inside a Radix Dialog.

**Props:**

```typescript
interface TaskFormProps {
  entityType: 'client' | 'company';
  entityId: string;
  onClose: () => void;
  onSuccess: () => void;
}
```

**Behavior:**

- Uses `react-hook-form` with `useForm<{ name: string; description: string }>()`.
- Renders design system `Input` with `label="Task Name"` and `Textarea` with `label="Description"`.
- On submit, calls `trigger('POST', { name, description, [entityType === 'client' ? 'clientId' : 'companyId']: entityId, status: 'todo' })`.
- Submit `Button` with `label="Create Task"` and `loading={isMutating}`.
- Cancel `Button` with `variant="secondary"` and `label="Cancel"`.

### FilesList.tsx

File: `/Users/neil/code/custom-apps/custom-app-base/components/resources/FilesList.tsx`

A `'use client'` component for displaying and uploading files.

**Props:**

```typescript
interface FilesListProps {
  entityType: 'client' | 'company';
  entityId: string;
  channelId?: string; // file channel ID, may need to be fetched or passed from parent
}
```

**Behavior:**

- Files require a `channelId` to query. If no `channelId` is available, show an informational message (files are organized by file channels in Assembly).
- When `channelId` is provided, fetch files using `useApi<FilesResponse>('/api/files', { channelId })`.
- Each file row renders: `Icon` with `icon="File"` (or a type-specific icon if `object` field indicates file type), `Body` for file name, `Body` (size `'xs'`) for formatted date.
- Upload button: design system `Button` with `label="Upload File"` and `prefixIcon="Upload"`. On click, trigger a hidden `<input type="file" />` via a ref.
- On file select, construct a request to POST to `/api/files`. The exact upload mechanism depends on the API route implementation (section 02). For this example app, file upload is intentionally simplified.
- Loading and empty states follow the same pattern as other resource lists.

### ResourceTabs.tsx

File: `/Users/neil/code/custom-apps/custom-app-base/components/shared/ResourceTabs.tsx`

A `'use client'` component that provides a tabbed interface for switching between Notes, Tasks, and Files.

**Props:**

```typescript
interface ResourceTabsProps {
  entityType: 'client' | 'company';
  entityId: string;
  channelId?: string; // for files
  onCreateAction?: (resourceType: 'notes' | 'tasks' | 'files') => void;
}
```

**Behavior:**

- Uses `@radix-ui/react-tabs` components: `Tabs.Root`, `Tabs.List`, `Tabs.Trigger`, `Tabs.Content`.
- Three tabs: "Notes", "Tasks", "Files".
- Maintains active tab in local state via `useState<string>('notes')`.
- Each tab content renders the corresponding resource component (`NotesList`, `TasksList`, `FilesList`) with `entityType` and `entityId` passed through.
- Uses `usePrimaryCta` from `/Users/neil/code/custom-apps/custom-app-base/bridge/hooks.ts` to set the header CTA based on the active tab:
  - `'notes'` tab -> `{ label: 'Add Note', icon: 'Plus', onClick: openNoteDialog }`
  - `'tasks'` tab -> `{ label: 'Add Task', icon: 'Plus', onClick: openTaskDialog }`
  - `'files'` tab -> `{ label: 'Upload File', icon: 'Upload', onClick: triggerFileUpload }`
- Manages dialog state for NoteForm and TaskForm. When the CTA is clicked, opens the appropriate Radix Dialog containing the form component.
- Style the tab triggers with Tailwind classes to match the app's design. The Radix Tabs component provides the accessibility and state management; styling is custom since the design system does not export a Tabs component.

### Radix Dialog Usage Pattern

Since the design system does not export a Dialog component, use `@radix-ui/react-dialog` directly. The pattern:

```typescript
import * as Dialog from '@radix-ui/react-dialog';

// In the component JSX:
<Dialog.Root open={showDialog} onOpenChange={setShowDialog}>
  <Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 bg-black/50" />
    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
      <Dialog.Title asChild>
        <Heading size="sm" tag="h2">Create Note</Heading>
      </Dialog.Title>
      <NoteForm ... />
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

### Radix Select Usage Pattern for Task Status

```typescript
import * as Select from '@radix-ui/react-select';

<Select.Root value={task.status} onValueChange={(value) => handleStatusChange(task.id, value)}>
  <Select.Trigger className="...">
    <Select.Value />
  </Select.Trigger>
  <Select.Portal>
    <Select.Content className="...">
      <Select.Item value="todo"><Select.ItemText>To Do</Select.ItemText></Select.Item>
      <Select.Item value="inProgress"><Select.ItemText>In Progress</Select.ItemText></Select.Item>
      <Select.Item value="completed"><Select.ItemText>Completed</Select.ItemText></Select.Item>
    </Select.Content>
  </Select.Portal>
</Select.Root>
```

## Key Implementation Notes

1. **All SDK response properties are optional.** Always filter with type guards before rendering. Never assume a property exists without checking.

2. **SWR cache invalidation.** After every mutation (create/update/delete), call the `mutate()` function returned by `useApi` to refresh the list. The `useApiMutation` hook from section 03 may handle this automatically if configured with a related SWR cache key.

3. **Mutation in-flight state.** Use `isMutating` from `useApiMutation` to disable buttons and show loading indicators during mutations. The `Button` component's `loading` prop handles this naturally.

4. **react-hook-form integration.** The form components use `react-hook-form` (already in `package.json` at `^7.60.0`). Register design system `Input` and `Textarea` components using the spread pattern: `{...register('fieldName', validationRules)}`. These components extend native HTML attributes so `register()` spread works directly.

5. **Token context.** Resource components do not handle tokens directly. The `useApi` and `useApiMutation` hooks (from section 03) read the token from `TokenProvider` context and inject it as an Authorization header.

6. **Design system constraints.** Do NOT fabricate props for design system components. The available props are documented above. Use Tailwind for layout and spacing around design system components. Never use native `<button>` elements -- always use `Button` or `IconButton`.

7. **Date formatting.** Use `date-fns` (already in dependencies at `4.1.0`) for formatting timestamps. Import `format` or `formatDistanceToNow` from `date-fns`.

8. **HTML content in notes.** Note content from the API is HTML. For display previews, strip HTML tags (simple regex or a utility function) and truncate. For edit mode, pass the raw HTML string to the Textarea (the example app does not need a rich text editor).

9. **Error handling.** Display mutation errors inline near the form or action that triggered them. Use `Body` with a red text className to show error messages from the `useApiMutation` error state.