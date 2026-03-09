# Assembly Custom App Development Guide

## App Context

This app is a Next.js iframe embedded in the Assembly dashboard (internal users) and client portal (clients). A `token` query parameter identifies the user, workspace, and context. The API key stays server-side — use server components or API routes for SDK calls, never client components.

Entry point: `app/page.tsx` (server component, routes by view type). Session init: `utils/session.ts`.

## General Guidelines

After making changes run `npx tsc --noEmit` to check for typescript errors and fix them before finalizing the changes.

## View Patterns

Three view types based on token payload (see `utils/types.ts` for `ViewType`):

| ViewType | Token Contains | Component | Route |
|---|---|---|---|
| `internal-overview` | `internalUserId` only | `InternalOverview` | `/` |
| `internal-detail` | `internalUserId` + `clientId`/`companyId` | `DetailView` | `/` or `/detail` |
| `client` | `clientId` (no `internalUserId`) | `ClientView` | `/` |

View type is determined in `utils/session.ts` via `determineViewType()`. The home page server component calls `getSession()` and renders the matching view. In-app navigation from overview to detail uses `app/detail/page.tsx` with query params.

## SDK Patterns

The SDK is generated from the [OpenAPI spec](https://docs.assembly.com/openapi/core-resources.json). Always verify method signatures from type definitions before use.

```
// Initialize (server-side only) — see utils/session.ts
const assembly = assemblyApi({ apiKey: process.env.ASSEMBLY_API_KEY!, token });

// All response properties are optional — always filter with type guards
const clients = await assembly.listClients({ limit: 20, nextToken });
const valid = (clients.data ?? []).filter(
  (c): c is typeof c & { id: string } => !!c.id
);
```

Key methods: `listClients`, `listCompanies`, `listNotes`, `createNote({ requestBody })`, `retrieveTasks`, `createTask({ requestBody })`, `listFiles({ channelId })`, `listFileChannels`. Mutations use `requestBody` in the parameter object. Pagination uses `limit` + `nextToken`.

## API Route Patterns

Token is passed via `Authorization: Bearer <token>` header (not query params). Routes use shared helpers from `app/api/_helpers.ts`:

```
// app/api/notes/route.ts — example pattern
const token = extractToken(request);  // from Authorization header
if (!token) return unauthorizedResponse();
const assembly = initSdk(token);
const result = await assembly.listNotes({ entityType, entityId });
return Response.json(result);
```

Error responses use `{ error: string }` shape (see `utils/types.ts` `ApiError`). Mutation routes validate with zod schemas. See `app/api/notes/route.ts` for a complete GET/POST/PUT/DELETE example.

## Bridge Patterns

The app bridge communicates with the parent Assembly frame for header controls. Configure before use with `useBridgeConfig(portalUrl)` — see `bridge/hooks.ts`.

```
// Detail view breadcrumbs with back navigation
useBreadcrumbs([
  { label: 'Custom App', onClick: () => router.push('/') },
  { label: entityName },
]);
// Header CTA button — auto-cleared on unmount
usePrimaryCta({ label: 'Add Note', icon: 'Plus', onClick: openDialog });
```

Available hooks: `useBreadcrumbs`, `usePrimaryCta`, `useSecondaryCta`, `useActionsMenu`. All auto-clear on component unmount.

## Design System

Import UI components from `@assembly-js/design-system`. Never use native HTML elements for buttons, headings, text, or form inputs.

```
import { Button, Heading, Body, Icon, Input, Textarea, Status, Spinner } from '@assembly-js/design-system';
```

Do NOT make up props — verify in [Storybook](https://design-system.assembly.com/). Key notes:
- `Button` uses `label` prop (not children), supports `variant`, `size`, `loading`
- `Input` and `Textarea` extend native HTML attributes, add `label` and `error` props
- For tabs, dialogs, and selects, use Radix primitives (`@radix-ui/react-tabs`, `@radix-ui/react-dialog`, `@radix-ui/react-select`) with Tailwind styling
- Loading states use `Spinner` component. For content-shaped placeholders, use `animate-pulse` divs

See `components/shared/EmptyState.tsx` and `components/resources/NoteForm.tsx` for examples.

## Data Fetching (Client Components)

Client components use SWR hooks from `hooks/useApi.ts`:

```
const { data, isLoading, mutate } = useApi<Response>('/api/notes', { entityId });
const { trigger, isMutating } = useApiMutation('/api/notes');
await trigger('POST', { title: 'New note', entityId, entityType });
```

Token injection is automatic via `TokenProvider` context. After mutations, related SWR cache keys are revalidated.

## Resources

- [Custom Apps Guide](https://docs.assembly.com/docs/custom-apps-overview)
- [API Reference](https://docs.assembly.com/reference/getting-started-introduction)
- [Design System Storybook](https://design-system.assembly.com/)
