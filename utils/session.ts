import { assemblyApi } from '@assembly-js/node-sdk';
import { need } from '@/utils/need';

/**
 * A helper function that instantiates the Assembly SDK and fetches data
 * from the Assembly API based on the contents of the token that gets
 * passed to your app in the searchParams.
 */
export async function getSession(searchParams: SearchParams) {
  // apiKey needs to be defined inside the function so we get the
  // error boundary page instead of a vercel error.
  const apiKey = need<string>(
    process.env.ASSEMBLY_API_KEY,
    'ASSEMBLY_API_KEY is required, guide available at: https://docs.assembly.com/docs/custom-apps-setting-up-your-first-app#step-2-register-your-app-and-get-an-api-key',
  );

  const assembly = assemblyApi({
    apiKey: apiKey,
    token:
      'token' in searchParams && typeof searchParams.token === 'string'
        ? searchParams.token
        : undefined,
  });

  const data: {
    workspace: Awaited<ReturnType<typeof assembly.retrieveWorkspace>>;
    client?: Awaited<ReturnType<typeof assembly.retrieveClient>>;
    company?: Awaited<ReturnType<typeof assembly.retrieveCompany>>;
    internalUser?: Awaited<ReturnType<typeof assembly.retrieveInternalUser>>;
  } = {
    workspace: await assembly.retrieveWorkspace(),
  };
  const tokenPayload = await assembly.getTokenPayload?.();

  if (tokenPayload?.clientId) {
    data.client = await assembly.retrieveClient({ id: tokenPayload.clientId });
  }
  if (tokenPayload?.companyId) {
    data.company = await assembly.retrieveCompany({
      id: tokenPayload.companyId,
    });
  }
  if (tokenPayload?.internalUserId) {
    data.internalUser = await assembly.retrieveInternalUser({
      id: tokenPayload.internalUserId,
    });
  }

  return data;
}

export type SessionData = Awaited<ReturnType<typeof getSession>>;
