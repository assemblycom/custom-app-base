'use client';

import { Button } from '@/components/ui/button';

const DASHBOARD_URL =
  process.env.ASSEMBLY_DASHBOARD_URL || 'https://dashboard.assembly.com';
const DEV_MODE_URL = `${DASHBOARD_URL}/dev-mode?url=http://localhost:8080`;

export function GettingStarted() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center gap-4">
      <h2 className="text-xl font-semibold tracking-tight">Welcome to Airtable for Assembly</h2>
      <p className="text-lg text-gray-500 max-w-md">
        This app is designed to run inside the Assembly dashboard. To get
        started with local development, open this app in dev mode.
      </p>
      <a href={DEV_MODE_URL}>
        <Button>Open in Dev Mode</Button>
      </a>
      <p className="text-sm text-gray-400">
        You'll need to be logged into your Assembly dashboard to use dev mode.
      </p>
    </div>
  );
}
