# Assembly Custom App Development Guide

## Context

This app runs as an **iframe** embedded within the Assembly.com dashboard (for internal users) and client portal (for clients). It communicates with the parent frame via the app-bridge for UI controls like breadcrumbs and header actions.

When your app loads, Assembly passes a `token` query parameter that identifies the current user, workspace, and context. This token is used with the Node SDK to fetch data and make API calls.

## TypeScript Rules

- Import types from source modules, don't recreate inline.
- Define stores/contexts before consuming components.
- Verify prop signatures before use; match type names exactly.
- Export constants needed by other files.

## Using the Node SDK

See `src/utils/session.ts` for a complete example.

- Before using SDK methods or accessing SDK type properties, read the source type/function definition to verify: (1) required vs optional parameters, (2) property nullability. Never assume signatures — verify in the same session.
- Initializing the SDK requires your API key and the session token from query params:

## Architecture Pattern

### Keep the API Key Server-Side

Use Next.js server components or API routes to make SDK calls:

```
src/
├── app/
│   ├── page.tsx          # Server component - can use SDK
│   └── api/
│       └── data/
│           └── route.ts  # API route - can use SDK
├── components/
│   └── MyClient.tsx      # Client component - fetch from API routes
└── utils/
    └── session.ts        # SDK helper (server-only)
```

### Creating API Routes

```typescript
// src/app/api/clients/route.ts
import { assemblyApi } from '@assembly-js/node-sdk';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  const assembly = assemblyApi({
    apiKey: process.env.ASSEMBLY_API_KEY!,
    token: token ?? undefined,
  });

  const clients = await assembly.listClients();
  return Response.json(clients);
}
```

### Client Components

Fetch data from your API routes, not directly from the SDK:

```typescript
'use client';

export function ClientList({ token }: { token: string }) {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    fetch(`/api/clients?token=${token}`)
      .then(res => res.json())
      .then(setClients);
  }, [token]);

  return <ul>{clients.map(c => <li key={c.id}>{c.givenName}</li>)}</ul>;
}
```

## Design System

Import components from `@assembly-js/design-system`:

```typescript
import { Button, Heading, Body, Icon } from '@assembly-js/design-system';
```

See the Design System section in the app for examples, or explore the full [Storybook](https://design-system.assembly.com/).

### Working with assembly design system components

- do NOT make up props for the assembly design system components, use the ones that are available. Don't assume additional HTML attributes will be spread to the underlying DOM element and compile correctly.

## Resources

- [Custom Apps Guide](https://docs.assembly.com/docs/custom-apps-overview)
- [API Reference](https://docs.assembly.com/reference/getting-started-introduction)
