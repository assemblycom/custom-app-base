import { getSession } from '@/utils/session';
import { TokenProvider } from '@/app/providers/TokenProvider';
import { InternalOverview } from '@/components/views/InternalOverview';
import { DetailView } from '@/components/views/DetailView';
import { ClientView } from '@/components/views/ClientView';
import { GettingStarted } from '@/app/examples/sections/GettingStarted';
import { MissingApiKey } from '@/app/examples/sections/MissingApiKey';
import { BridgeConfigProvider } from '@/app/examples/sections/BridgeConfigProvider';

export const dynamic = 'force-dynamic';

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const token =
    'token' in params && typeof params.token === 'string'
      ? params.token
      : undefined;

  if (!process.env.ASSEMBLY_API_KEY) {
    return <MissingApiKey />;
  }

  if (!token) {
    return <GettingStarted />;
  }

  const session = await getSession(params);

  return (
    <TokenProvider token={token}>
      <BridgeConfigProvider portalUrl={session.workspace?.portalUrl} />
      {session.viewType === 'internal-overview' && (
        <InternalOverview token={token} />
      )}
      {session.viewType === 'internal-detail' && (
        <DetailView
          token={token}
          entityType={session.client ? 'client' : 'company'}
          entityId={(session.client?.id ?? session.company?.id) || ''}
          entityName={
            session.client
              ? [session.client.givenName, session.client.familyName].filter(Boolean).join(' ')
              : session.company?.name || 'Unknown'
          }
          entityInfo={session.client?.email ?? undefined}
        />
      )}
      {session.viewType === 'client' && (
        <ClientView session={session} token={token} />
      )}
    </TokenProvider>
  );
}
