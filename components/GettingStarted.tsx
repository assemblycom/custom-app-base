'use client';

import { Body, Heading, Button } from '@assembly-js/design-system';

const DASHBOARD_URL =
  process.env.ASSEMBLY_DASHBOARD_URL || 'https://dashboard.assembly.com';
const DEV_MODE_URL = `${DASHBOARD_URL}/dev-mode?url=http://localhost:8080`;

export function GettingStarted() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center gap-4">
      <Heading size="xl">Welcome to Airtable for Assembly</Heading>
      <Body size="lg" className="text-gray-500 max-w-md">
        This app is designed to run inside the Assembly dashboard. To get
        started with local development, open this app in dev mode.
      </Body>
      <a href={DEV_MODE_URL}>
        <Button label="Open in Dev Mode" />
      </a>
      <Body size="sm" className="text-gray-400">
        You'll need to be logged into your Assembly dashboard to use dev mode.
      </Body>
    </div>
  );
}
