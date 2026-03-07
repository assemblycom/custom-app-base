import { z } from 'zod';
import {
  extractToken,
  initSdk,
  unauthorizedResponse,
  errorResponse,
} from '@/app/api/_helpers';

const createNoteSchema = z.object({
  entityType: z.string().min(1),
  entityId: z.string().min(1),
  title: z.string().min(1),
  content: z.string().optional(),
});

const updateNoteSchema = z.object({
  id: z.string().min(1),
  title: z.string().optional(),
  content: z.string().optional(),
});

export async function GET(request: Request) {
  const token = extractToken(request);
  if (!token) return unauthorizedResponse();

  try {
    const assembly = initSdk(token);
    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get('entityType') ?? undefined;
    const entityId = searchParams.get('entityId') ?? undefined;
    const limit = Number(searchParams.get('limit')) || 20;
    const nextToken = searchParams.get('nextToken') ?? undefined;

    const result = await assembly.listNotes({
      entityType,
      entityId,
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
    const parsed = createNoteSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 400);
    }

    const assembly = initSdk(token);
    const result = await assembly.createNote({ requestBody: parsed.data });
    return Response.json(result);
  } catch (err) {
    return errorResponse(
      err instanceof Error ? err.message : 'Unknown error',
    );
  }
}

export async function PUT(request: Request) {
  const token = extractToken(request);
  if (!token) return unauthorizedResponse();

  try {
    const body = await request.json();
    const parsed = updateNoteSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 400);
    }

    const { id, ...requestBody } = parsed.data;
    const assembly = initSdk(token);
    const result = await assembly.updateNote({ id, requestBody });
    return Response.json(result);
  } catch (err) {
    return errorResponse(
      err instanceof Error ? err.message : 'Unknown error',
    );
  }
}

export async function DELETE(request: Request) {
  const token = extractToken(request);
  if (!token) return unauthorizedResponse();

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return errorResponse('id is required', 400);

    const assembly = initSdk(token);
    const result = await assembly.deleteNote({ id });
    return Response.json(result);
  } catch (err) {
    return errorResponse(
      err instanceof Error ? err.message : 'Unknown error',
    );
  }
}
