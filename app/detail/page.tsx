import { assemblyApi } from '@assembly-js/node-sdk';
import { need } from '@/utils/need';
import { TokenProvider } from '@/app/providers/TokenProvider';
import { DetailView } from '@/components/views/DetailView';

export const dynamic = 'force-dynamic';

export default async function DetailPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const token =
    'token' in params && typeof params.token === 'string'
      ? params.token
      : undefined;
  const clientId =
    'clientId' in params && typeof params.clientId === 'string'
      ? params.clientId
      : undefined;
  const companyId =
    'companyId' in params && typeof params.companyId === 'string'
      ? params.companyId
      : undefined;

  if (!token) {
    return <div className="p-8 text-gray-500">Missing token</div>;
  }

  if (!clientId && !companyId) {
    return (
      <div className="p-8 text-gray-500">
        Missing clientId or companyId parameter
      </div>
    );
  }

  const apiKey = need<string>(
    process.env.ASSEMBLY_API_KEY,
    'ASSEMBLY_API_KEY is required',
  );
  const assembly = await assemblyApi({ apiKey, token });

  let entityType: 'client' | 'company';
  let entityId: string;
  let entityName: string;
  let entityInfo: string | undefined;
  let portalUrl: string | undefined;

  try {
    const workspace = await assembly.retrieveWorkspace();
    portalUrl = workspace?.portalUrl ?? undefined;

    if (clientId) {
      entityType = 'client';
      entityId = clientId;
      const client = await assembly.retrieveClient({ id: clientId });
      entityName =
        [client?.givenName, client?.familyName].filter(Boolean).join(' ') ||
        'Client';
      entityInfo = client?.email ?? undefined;
    } else {
      entityType = 'company';
      entityId = companyId!;
      const company = await assembly.retrieveCompany({ id: companyId! });
      entityName = company?.name || 'Company';
    }
  } catch {
    return <div className="p-8 text-red-500">Failed to load entity data</div>;
  }

  return (
    <TokenProvider token={token}>
      <DetailView
        token={token}
        entityType={entityType}
        entityId={entityId}
        entityName={entityName}
        entityInfo={entityInfo}
        portalUrl={portalUrl}
      />
    </TokenProvider>
  );
}
