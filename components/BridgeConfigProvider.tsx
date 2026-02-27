'use client';

import { useBridgeConfig } from '@/bridge/hooks';

interface BridgeConfigProviderProps {
  portalUrl?: string;
  children?: React.ReactNode;
}

export function BridgeConfigProvider({ portalUrl, children }: BridgeConfigProviderProps) {
  useBridgeConfig(portalUrl);
  return <>{children}</>;
}
