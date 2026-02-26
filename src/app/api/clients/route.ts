import { assemblyApi } from '@assembly-js/node-sdk';
import { need } from '@/utils/need';

export async function GET(request: Request) {
  const apiKey = need<string>(
    process.env.ASSEMBLY_API_KEY,
    'ASSEMBLY_API_KEY is required',
  );

  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token') ?? undefined;
  const search = searchParams.get('search') ?? '';

  const assembly = assemblyApi({ apiKey, token });

  try {
    const result = await assembly.listClients({ limit: 100 });
    let clients = result.data ?? [];

    if (search.trim()) {
      const query = search.trim().toLowerCase();
      clients = clients.filter((client) => {
        const fullName = [client.givenName, client.familyName]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        const email = (client.email ?? '').toLowerCase();
        return fullName.includes(query) || email.includes(query);
      });
    }

    return Response.json({ success: true, data: clients });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
