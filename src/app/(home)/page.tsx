import { Container } from '@/components/Container';
import { getSession } from '@/utils/session';
import { GettingStarted } from './sections/GettingStarted';
import { MissingApiKey } from './sections/MissingApiKey';
import { BridgeConfigProvider } from './sections/BridgeConfigProvider';
import { TokenProvider } from '@/app/providers/TokenProvider';
import { ClientPicker } from './sections/ClientPicker';
import { ClientSummary } from './sections/ClientSummary';

export const dynamic = 'force-dynamic';

async function Content({ searchParams }: { searchParams: SearchParams }) {
  const session = await getSession(searchParams);
  const token =
    'token' in searchParams && typeof searchParams.token === 'string'
      ? searchParams.token
      : undefined;

  const isInternalUser = !!session.internalUser;

  return (
    <>
      <BridgeConfigProvider portalUrl={session.workspace?.portalUrl} />
      <Container className="max-w-screen-lg">
        <TokenProvider token={token ?? ''}>
          {isInternalUser ? (
            <ClientPicker />
          ) : (
            <ClientSummary
              client={session.client}
              company={session.company}
              isInternalUser={false}
            />
          )}
        </TokenProvider>
      </Container>
    </>
  );
}

export default async function Home({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const hasToken = 'token' in params && typeof params.token === 'string';

  // Check for API key before proceeding
  if (!process.env.ASSEMBLY_API_KEY) {
    return <MissingApiKey />;
  }

  if (!hasToken) {
    return <GettingStarted />;
  }

  return <Content searchParams={params} />;
}
