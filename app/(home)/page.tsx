import { Container } from '@/components/Container';
import { getSession } from '@/utils/session';
import { Header } from './sections/Header';
import { SessionContext } from './sections/SessionContext';
import { HeaderControls } from './sections/HeaderControls';
import { DesignShowcase } from './sections/DesignShowcase';
import { Resources } from './sections/Resources';
import { RequestTester } from './sections/RequestTester';
import { GettingStarted } from './sections/GettingStarted';
import { MissingApiKey } from './sections/MissingApiKey';
import { BridgeConfigProvider } from './sections/BridgeConfigProvider';

export const dynamic = 'force-dynamic';

async function Content({ searchParams }: { searchParams: SearchParams }) {
  const session = await getSession(searchParams);
  const token =
    'token' in searchParams && typeof searchParams.token === 'string'
      ? searchParams.token
      : undefined;

  return (
    <>
      <BridgeConfigProvider portalUrl={session.workspace?.portalUrl} />
      <Container className="max-w-screen-lg">
        <Header />
        <div className="space-y-12">
          <Resources />
          <SessionContext session={session} />
          <RequestTester token={token} />
          <HeaderControls />
          <DesignShowcase />
        </div>
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
