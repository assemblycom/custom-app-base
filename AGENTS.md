# Assembly Custom App Development Guide

## App Context

This app is a Next.js iframe embedded in the Assembly dashboard (internal users) and client portal (clients). A `token` query parameter identifies the user, workspace, and context. The API key stays server-side — use server components or API routes for SDK calls, never client components.

Entry point: `app/page.tsx` (server component, routes by view type). Session init: `utils/session.ts`.

## General Guidelines

After making changes run `npx tsc --noEmit` to check for typescript errors and fix them before finalizing the changes.

## View Patterns

Three view types based on token payload (see `utils/types.ts` for `ViewType`):

| ViewType            | Token Contains                            | Component          | Route            |
| ------------------- | ----------------------------------------- | ------------------ | ---------------- |
| `internal-overview` | `internalUserId` only                     | `InternalOverview` | `/`              |
| `internal-detail`   | `internalUserId` + `clientId`/`companyId` | `DetailView`       | `/` or `/detail` |
| `client`            | `clientId` (no `internalUserId`)          | `ClientView`       | `/`              |

View type is determined in `utils/session.ts` via `determineViewType()`. The home page server component calls `getSession()` and renders the matching view. In-app navigation from overview to detail uses `app/detail/page.tsx` with query params.

## SDK Patterns

The SDK is generated from the [OpenAPI spec](https://docs.assembly.com/openapi/core-resources.json). Always verify method signatures from type definitions before use.

```
// Initialize (server-side only) — see utils/session.ts
const assembly = await assemblyApi({ apiKey: process.env.ASSEMBLY_API_KEY!, token });

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
const assembly = await initSdk(token);
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

This project is mid-migration from `@assembly-js/design-system` to a local shadcn-style registry under `@/components/ui/*`. Prefer the shadcn components. Only fall back to `@assembly-js/design-system` when a shadcn equivalent does not yet exist in `components/ui/`.

**Preferred — shadcn registry (`@/components/ui/*`):**
- `Button` — `@/components/ui/button` — variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`; sizes: `default`, `sm`, `lg`, `icon`. Uses `children` (not a `label` prop). No built-in `loading` prop — pass `disabled` and render `<Spinner />` as a child for loading state.
- `Spinner` — `@/components/ui/spinner` — defaults to `size-4`; pass `className="size-5"` (or similar) to resize.
- Icon buttons — use `Button` with `size="icon"` and an assembly-js `<Icon>` as the child. Pass `aria-label` for accessibility. For a smaller icon button, override with `className="h-7 w-7"` (or similar).
- Check `components/ui/` for additional components before importing anything from `@assembly-js/design-system`.

**Fallback — `@assembly-js/design-system`:**
Still used for components not yet migrated: `Body`, `Heading`, `Icon`, `Input`, `Textarea`, `Status`. Do **not** import `Button`, `IconButton`, or `Spinner` from `@assembly-js/design-system` — use the shadcn versions above.

**Rules for both:**
- Do not make up props. Read the types in `design-system.d.ts` (for assembly-js) or the component source under `components/ui/` (for shadcn).
- Do not assume additional HTML attributes will be spread to the underlying DOM element and compile correctly (especially for assembly-js components).
- **Before defining custom types that will be passed to a design-system component, read the component's type definitions first.** Derive the value type directly from the component's prop types rather than guessing.
- Use `lucide-react` only when explicitly requested. By default, keep `@assembly-js/design-system` icons (`Icon`, `IconButton`) for iconography until an `Icon` shadcn equivalent is introduced.

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
