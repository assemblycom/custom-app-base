import { z } from 'zod';
import {
  extractToken,
  initSdk,
  unauthorizedResponse,
  errorResponse,
} from '@/app/api/_helpers';

const createTaskSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  status: z.string().optional(),
  clientId: z.string().optional(),
  companyId: z.string().optional(),
  dueDate: z.string().optional(),
});

const updateTaskSchema = z.object({
  id: z.string().min(1),
  name: z.string().optional(),
  description: z.string().optional(),
  status: z.string().optional(),
  dueDate: z.string().optional(),
  isArchived: z.boolean().optional(),
});

export async function GET(request: Request) {
  const token = extractToken(request);
  if (!token) return unauthorizedResponse();

  try {
    const assembly = initSdk(token);
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId') ?? undefined;
    const companyId = searchParams.get('companyId') ?? undefined;
    const status = searchParams.get('status') ?? undefined;
    const limit = Number(searchParams.get('limit')) || 20;
    const nextToken = searchParams.get('nextToken') ?? undefined;

    const result = await assembly.retrieveTasks({
      clientId,
      companyId,
      status,
      limit,
      nextToken,
    });
    return Response.json(result);
  } catch (err) {
    console.error(err);
    return errorResponse(err instanceof Error ? err.message : 'Unknown error');
  }
}

export async function POST(request: Request) {
  const token = extractToken(request);
  if (!token) return unauthorizedResponse();

  try {
    const body = await request.json();
    const parsed = createTaskSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 400);
    }

    const assembly = initSdk(token);
    const result = await assembly.createTask({ requestBody: parsed.data });
    return Response.json(result);
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : 'Unknown error');
  }
}

export async function PUT(request: Request) {
  const token = extractToken(request);
  if (!token) return unauthorizedResponse();

  try {
    const body = await request.json();
    const parsed = updateTaskSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(parsed.error.issues[0].message, 400);
    }

    const { id, ...requestBody } = parsed.data;
    const assembly = initSdk(token);
    const result = await assembly.updateTask({ id, requestBody });
    return Response.json(result);
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : 'Unknown error');
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
    const result = await assembly.deleteTask({ id });
    return Response.json(result);
  } catch (err) {
    return errorResponse(err instanceof Error ? err.message : 'Unknown error');
  }
}
