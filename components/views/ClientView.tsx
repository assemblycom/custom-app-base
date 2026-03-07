'use client';

import { Heading, Body } from '@assembly-js/design-system';
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
        <Body className="text-gray-500">Unable to load client data.</Body>
      </Container>
    );
  }

  return (
    <Container className="max-w-screen-md">
      <div className="mb-8">
        <Heading size="xl" tag="h1">
          {clientName}
        </Heading>
        {client?.email && (
          <Body size="sm" className="text-gray-500 mt-1">
            {client.email}
          </Body>
        )}
        {company?.name && (
          <Body size="sm" className="text-gray-400 mt-1">
            {company.name}
          </Body>
        )}
      </div>

      <ResourceTabs entityType="client" entityId={clientId} />
    </Container>
  );
}
