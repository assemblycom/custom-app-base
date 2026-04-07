import {
  extractToken,
  initSdk,
  unauthorizedResponse,
  errorResponse,
} from '@/app/api/_helpers';

export async function GET(request: Request) {
  const token = extractToken(request);
  if (!token) return unauthorizedResponse();

  try {
    const assembly = await initSdk(token);
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId') ?? undefined;
    const limit = Number(searchParams.get('limit')) || 20;
    const nextToken = searchParams.get('nextToken') ?? undefined;

    const result = await assembly.listClients({ companyId, limit, nextToken });
    return Response.json(result);
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : 'Unknown error');
  }
}
