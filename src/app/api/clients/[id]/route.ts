import { assemblyApi } from '@assembly-js/node-sdk';
import { need } from '@/utils/need';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const apiKey = need<string>(
    process.env.ASSEMBLY_API_KEY,
    'ASSEMBLY_API_KEY is required',
  );

  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token') ?? undefined;

  const assembly = assemblyApi({ apiKey, token });

  try {
    const client = await assembly.retrieveClient({ id });

    let company = null;
    if (client.companyId) {
      try {
        company = await assembly.retrieveCompany({ id: client.companyId });
      } catch {
        // Company fetch is best-effort
      }
    }

    return Response.json({ success: true, data: { client, company } });
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
