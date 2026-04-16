'use client';

import { Container } from '@/components/Container';
import { ResourceTabs } from '@/components/shared/ResourceTabs';
import { useBreadcrumbs } from '@/bridge/hooks';
import type { SessionData } from '@/utils/session';

interface ClientViewProps {
  session: SessionData;
  token: string;
}

export function ClientView({ session }: ClientViewProps) {
  useBreadcrumbs([{ label: 'Custom App' }]);

  const client = session.client;
  const company = session.company;

  const clientName = client
    ? [client.givenName, client.familyName].filter(Boolean).join(' ')
    : 'Client';

  const clientId = client?.id;

  if (!clientId) {
    return (
      <Container className="max-w-screen-md">
        <p className="text-gray-500">Unable to load client data.</p>
      </Container>
    );
  }

  return (
    <Container className="max-w-screen-md">
      <div className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight">
          {clientName}
        </h1>
        {client?.email && (
          <p className="text-sm text-gray-500 mt-1">
            {client.email}
          </p>
        )}
        {company?.name && (
          <p className="text-sm text-gray-400 mt-1">
            {company.name}
          </p>
        )}
      </div>

      <ResourceTabs entityType="client" entityId={clientId} />
    </Container>
  );
}
