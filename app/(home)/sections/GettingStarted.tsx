import { Container } from '@/components/Container';

const DASHBOARD_URL =
  process.env.ASSEMBLY_DASHBOARD_URL || 'https://dashboard.assembly.com';
const DEV_MODE_URL = `${DASHBOARD_URL}/dev-mode?url=http://localhost:8080`;

export function GettingStarted() {
  return (
    <Container className="max-w-screen-lg">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <h1 className="text-3xl font-bold">Welcome to Custom App Base</h1>
        <p className="text-lg text-gray-600 max-w-md">
          This app is designed to run inside the Assembly dashboard. To get
          started with local development, open this app in dev mode.
        </p>
        <a
          href={DEV_MODE_URL}
          className="inline-flex items-center px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Open in Dev Mode
        </a>
        <p className="text-sm text-gray-500">
          You'll need to be logged into your Assembly dashboard to use dev mode.
        </p>
      </div>
    </Container>
  );
}
