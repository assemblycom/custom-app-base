'use client';

import { useRouter } from 'next/navigation';
import { Container } from '@/components/Container';
import { ResourceTabs } from '@/components/shared/ResourceTabs';
import { useBreadcrumbs, useBridgeConfig } from '@/bridge/hooks';

interface DetailViewProps {
  token: string;
  entityType: 'client' | 'company';
  entityId: string;
  entityName: string;
  entityInfo?: string;
  portalUrl?: string | null;
}

export function DetailView({
  token,
  entityType,
  entityId,
  entityName,
  entityInfo,
  portalUrl,
}: DetailViewProps) {
  const router = useRouter();

  useBridgeConfig(portalUrl);
  useBreadcrumbs([
    {
      label: 'Custom App',
      onClick: () => router.push(`/?token=${token}`),
    },
    { label: entityName },
  ]);

  return (
    <Container className="max-w-screen-md">
      <div className="mb-8">
        <h1 className="text-xl font-semibold tracking-tight">
          {entityName}
        </h1>
        {entityInfo && (
          <p className="text-sm text-gray-500 mt-1">
            {entityInfo}
          </p>
        )}
        <p className="text-xs text-gray-400 mt-1 capitalize">
          {entityType}
        </p>
      </div>

      <ResourceTabs entityType={entityType} entityId={entityId} />
    </Container>
  );
}
