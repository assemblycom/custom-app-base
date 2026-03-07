import { z } from 'zod';
import {
  extractToken,
  initSdk,
  unauthorizedResponse,
  errorResponse,
} from '@/app/api/_helpers';

const createFileSchema = z.object({
  fileType: z.string().min(1),
  path: z.string().min(1),
  channelId: z.string().min(1),
  linkUrl: z.string().optional(),
  clientPermissions: z.enum(['read_write', 'read_only']).optional(),
});

export async function GET(request: Request) {
  const token = extractToken(request);
  if (!token) return unauthorizedResponse();

  try {
    const assembly = initSdk(token);
    const { searchParams } = new URL(request.url);
    const channelId = searchParams.get('channelId');
    if (!channelId) return errorResponse('channelId is required', 400);

    const path = searchParams.get('path') ?? undefined;
    const limit = Number(searchParams.get('limit')) || 20;
    const nextToken = searchParams.get('nextToken') ?? undefined;

    const result = await assembly.listFiles({
      channelId,
      path,
      limit,
      nextToken,
    });
    return Response.json(result);
  } catch (err) {
    return errorResponse(
      err instanceof Error ? err.message : 'Unknown error',
    );
  }
}

export async function POST(request: Request) {
  const token = extractToken(request);
  if (!token) return unauthorizedResponse();

  try {
    const body = await request.json();
    const parsed = createFileSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 400);
    }

    const { fileType, ...requestBody } = parsed.data;
    const assembly = initSdk(token);
    const result = await assembly.createFile({ fileType, requestBody });
    return Response.json(result);
  } catch (err) {
    return errorResponse(
      err instanceof Error ? err.message : 'Unknown error',
    );
  }
}
