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

Use the local assembly-ui registry components under `@/components/ui/*` when available. Fall back to standard shadcn conventions (plain HTML elements + Tailwind classes) otherwise. The only component still imported from `@assembly-js/design-system` is `Icon` (and its `IconType` type) — use it for all iconography.

**Registry components (`@/components/ui/*`):**
- `Badge` — `@/components/ui/badge` — variants: `default`, `secondary`, `destructive`, `outline`.
- `Button` — `@/components/ui/button` — variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`; sizes: `default`, `sm`, `lg`, `icon`. Uses `children` (not a `label` prop). No built-in `loading` prop — pass `disabled` and render `<Spinner />` as a child for loading state.
- `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage` — `@/components/ui/form` — react-hook-form integration using the Controller pattern. Wrap forms with `<Form {...form}>` and use `<FormField control={form.control} name="fieldName" render={...} />`.
- `Input` — `@/components/ui/input` — styled `<input>`. Use inside `FormControl` for form fields.
- `Label` — `@/components/ui/label` — standalone label component.
- `Spinner` — `@/components/ui/spinner` — defaults to `size-4`; pass `className="size-5"` (or similar) to resize.
- `Textarea` — `@/components/ui/textarea` — styled `<textarea>`. Use inside `FormControl` for form fields.

**Icon buttons** — use `Button` with `size="icon"` and an `<Icon>` from `@assembly-js/design-system` as the child. Pass `aria-label` for accessibility. For a smaller icon button, override with `className="h-7 w-7"` (or similar).

**Typography** — use plain HTML elements (`<h1>`–`<h6>`, `<p>`, `<span>`) with Tailwind classes. For headings, add `font-semibold tracking-tight`. Font size tokens are defined in `tailwind.config.ts` (`text-2xs` through `text-3xl`).

**Icons — `@assembly-js/design-system`:**
`Icon` and `IconType` are the only imports from `@assembly-js/design-system`. Do **not** import any other components from it — use the registry components or plain HTML + Tailwind instead. Do not use `lucide-react` unless explicitly requested.

The `Icon` component signature is: `<Icon icon={IconType} {...svgProps} />` where:
- `icon` (required) — the icon name as an `IconType` string, e.g. `"Plus"`, `"Trash"`, `"Edit"`, `"Settings"`, `"Close"`, `"Search"`, `"ChevronDown"`, `"ArrowNE"`, `"File"`, `"Message"`, `"Book"`.
- It does **not** accept `name`, `size`, `type`, or `variant` props. There is no `name` prop — use `icon`.
- It spreads `SVGProps<SVGSVGElement>`, so you can pass `className`, `width`, `height`, etc. Size the icon with `className="w-5 h-5"` (or similar Tailwind classes), not a `size` prop.

```tsx
import { Icon } from '@assembly-js/design-system';

<Icon icon="Plus" className="w-5 h-5" />
<Icon icon="Trash" className="w-4 h-4 text-gray-400" />
```

**Rules:**
- Do not make up props. Read the component source under `components/ui/` before using a component.
- **Before defining custom types that will be passed to a component, read the component's type definitions first.** Derive the value type directly from the component's prop types rather than guessing.

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
