import { assemblyApi } from '@assembly-js/node-sdk';
import { need } from '@/utils/need';

const OPERATIONS = {
  listClients: 'listClients',
  retrieveClient: 'retrieveClient',
  listCompanies: 'listCompanies',
  retrieveCompany: 'retrieveCompany',
} as const;

type Operation = keyof typeof OPERATIONS;

export async function POST(request: Request) {
  const apiKey = need<string>(
    process.env.ASSEMBLY_API_KEY,
    'ASSEMBLY_API_KEY is required',
  );

  const { operation, id, token, limit } = (await request.json()) as {
    operation: Operation;
    id?: string;
    token?: string;
    limit?: number;
  };

  const assembly = assemblyApi({
    apiKey,
    token,
  });

  try {
    const startTime = Date.now();
    let data: unknown;

    switch (operation) {
      case 'listClients':
        data = await assembly.listClients({ limit: limit ?? 5 });
        break;
      case 'retrieveClient':
        if (!id) {
          return Response.json(
            { success: false, error: 'Client ID is required' },
            { status: 400 },
          );
        }
        data = await assembly.retrieveClient({ id });
        break;
      case 'listCompanies':
        data = await assembly.listCompanies({ limit: limit ?? 5 });
        break;
      case 'retrieveCompany':
        if (!id) {
          return Response.json(
            { success: false, error: 'Company ID is required' },
            { status: 400 },
          );
        }
        data = await assembly.retrieveCompany({ id });
        break;
      default:
        return Response.json(
          { success: false, error: `Unknown operation: ${operation}` },
          { status: 400 },
        );
    }

    const duration = Date.now() - startTime;

    return Response.json({
      success: true,
      data,
      duration,
    });
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
