# Assembly Custom App Development Guide

## Context

This app runs as an **iframe** embedded within the Assembly.com dashboard (for internal users) and client portal (for clients). It communicates with the parent frame via the app-bridge for UI controls like breadcrumbs and header actions.

When your app loads, Assembly passes a `token` query parameter that identifies the current user, workspace, and context. This token is used with the Node SDK to fetch data and make API calls.

## Getting Started

### 1. Install Dependencies

```bash
yarn install
```

### 2. Create a Custom App in Assembly

1. Log into your Assembly workspace
2. Navigate to **Settings > App Setup**
3. Click **Add App** and select **Custom App**
4. Leave the URLs blank for now (dev-mode handles local development)
5. Save and note your **API Key**

### 3. Configure Your Environment

Create a `.env.local` file:

```env
ASSEMBLY_API_KEY=your_api_key_here
```

The API key must stay server-side only. Never expose it to the client.

### 4. Run the Dev Server

```bash
yarn dev
```

This starts the app on port 8080 and opens the Assembly dev-mode page.

## Using the Node SDK

### Initializing the SDK

The SDK requires your API key and the session token from query params:

```typescript
import { assemblyApi } from '@assembly-js/node-sdk';

const assembly = assemblyApi({
  apiKey: process.env.ASSEMBLY_API_KEY,
  token: searchParams.token, // From the iframe URL
});
```

### Fetching Session Data

```typescript
// Get workspace info
const workspace = await assembly.retrieveWorkspace();

// Get token payload to identify the current user
const tokenPayload = await assembly.getTokenPayload();

// Fetch user data based on token
if (tokenPayload?.clientId) {
  const client = await assembly.retrieveClient({ id: tokenPayload.clientId });
}
if (tokenPayload?.internalUserId) {
  const user = await assembly.retrieveInternalUser({
    id: tokenPayload.internalUserId,
  });
}
```

See `src/utils/session.ts` for a complete example.

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
