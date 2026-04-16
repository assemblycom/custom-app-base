'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/Container';
import { EntityPicker, type Entity } from '@/components/shared/EntityPicker';
import { Pagination } from '@/components/shared/Pagination';
import { useBreadcrumbs } from '@/bridge/hooks';
import { useApi } from '@/hooks/useApi';

interface ClientItem {
  id?: string;
  givenName?: string;
  familyName?: string;
  email?: string;
}

interface CompanyItem {
  id?: string;
  name?: string;
}

interface ListResponse<T> {
  data?: T[];
  nextToken?: string;
}

export function InternalOverview({ token }: { token: string }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'clients' | 'companies'>(
    'clients',
  );
  const [nextTokenState, setNextTokenState] = useState<string | undefined>();

  useBreadcrumbs([{ label: 'Custom App' }]);

  const params: Record<string, string> = { limit: '20' };
  if (nextTokenState) params.nextToken = nextTokenState;

  const clientsResult = useApi<ListResponse<ClientItem>>(
    '/api/clients',
    activeTab === 'clients' ? params : undefined,
  );
  const companiesResult = useApi<ListResponse<CompanyItem>>(
    '/api/companies',
    activeTab === 'companies' ? params : undefined,
  );

  const activeResult =
    activeTab === 'clients' ? clientsResult : companiesResult;

  const entities: Entity[] =
    activeTab === 'clients'
      ? (clientsResult.data?.data ?? [])
          .filter(
            (c): c is ClientItem & { id: string; givenName: string } =>
              !!c.id && !!c.givenName,
          )
          .map((c) => ({
            id: c.id,
            name: [c.givenName, c.familyName].filter(Boolean).join(' '),
            detail: c.email,
          }))
      : (companiesResult.data?.data ?? [])
          .filter(
            (c): c is CompanyItem & { id: string; name: string } =>
              !!c.id && !!c.name,
          )
          .map((c) => ({
            id: c.id,
            name: c.name,
          }));

  const handleSelect = (entity: Entity) => {
    const param =
      activeTab === 'clients'
        ? `clientId=${entity.id}`
        : `companyId=${entity.id}`;
    router.push(`/detail?${param}&token=${token}`);
  };

  const handleTabChange = (tab: 'clients' | 'companies') => {
    setActiveTab(tab);
    setNextTokenState(undefined);
  };

  return (
    <Container className="max-w-screen-md">
      <h1 className="text-xl font-semibold tracking-tight mb-6">
        Overview
      </h1>

      <div className="flex gap-2 mb-6 border-b border-gray-200 pb-2">
        <Button
          variant={activeTab === 'clients' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleTabChange('clients')}
        >
          Clients
        </Button>
        <Button
          variant={activeTab === 'companies' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleTabChange('companies')}
        >
          Companies
        </Button>
      </div>

      <EntityPicker
        entities={entities}
        onSelect={handleSelect}
        isLoading={activeResult.isLoading}
      />

      <Pagination
        nextToken={activeResult.data?.nextToken}
        onPageChange={setNextTokenState}
      />
    </Container>
  );
}
