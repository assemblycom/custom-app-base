// In-memory store for client notes.
// In production, replace this with a persistent database.
const notesStore = new Map<string, string>();

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const notes = notesStore.get(id) ?? '';
  return Response.json({ success: true, data: { notes } });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { notes } = (await request.json()) as { notes: string };

  notesStore.set(id, notes ?? '');

  return Response.json({ success: true, data: { notes: notesStore.get(id) } });
}
