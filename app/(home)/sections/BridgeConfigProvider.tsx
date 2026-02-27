'use client';

import { useBridgeConfig } from '@/bridge/hooks';

interface BridgeConfigProviderProps {
  portalUrl?: string;
  children?: React.ReactNode;
}

/**
 * Client component that configures the app bridge with the workspace portal URL.
 * This should be rendered early in the component tree to ensure the bridge
 * is configured before any messages are sent.
 */
export function BridgeConfigProvider({ portalUrl, children }: BridgeConfigProviderProps) {
  useBridgeConfig(portalUrl);
  return <>{children}</>;
}
