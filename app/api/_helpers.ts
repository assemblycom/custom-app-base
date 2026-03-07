import { assemblyApi } from '@assembly-js/node-sdk';
import { need } from '@/utils/need';

/** Extract bearer token from Authorization header. Returns null if missing/invalid. */
export function extractToken(request: Request): string | null {
  const auth = request.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) return null;
  const token = auth.slice(7).trim();
  return token || null;
}

/** Initialize the Assembly SDK with API key and token. */
export function initSdk(token: string) {
  const apiKey = need<string>(
    process.env.ASSEMBLY_API_KEY,
    'ASSEMBLY_API_KEY is required',
  );
  return assemblyApi({ apiKey, token });
}

/** Return a 401 response for missing/invalid authorization. */
export function unauthorizedResponse() {
  return Response.json(
    { error: 'Authorization header required' },
    { status: 401 },
  );
}

/** Return a structured error response. */
export function errorResponse(message: string, status: number = 500) {
  return Response.json({ error: message }, { status });
}
