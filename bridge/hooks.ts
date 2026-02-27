'use client';

import { useEffect, useMemo, useRef } from 'react';
import {
  AssemblyBridge,
  type BreadcrumbItem,
  type CtaConfig,
  type ActionMenuItem,
  type CtaIcon,
  type Icon,
} from '@assembly-js/app-bridge';

// Module-level flag to ensure bridge is only configured once across all instances
let bridgeConfigured = false;

/**
 * React hook to configure the app bridge with workspace-specific allowed origins.
 * Should be called early in the app lifecycle with the workspace portal URL.
 * Only configures once per application, even if called multiple times.
 *
 * @param portalUrl - The workspace's portal URL (e.g., "portal.example.com")
 *
 * @example
 * // In a client component that receives portalUrl from server
 * useBridgeConfig(workspace.portalUrl);
 */
export function useBridgeConfig(portalUrl: string | undefined | null) {
  useEffect(() => {
    if (portalUrl && !bridgeConfigured) {
      // Strip any existing protocol to avoid double-protocol URLs
      const cleanUrl = portalUrl.replace(/^https?:\/\//, '');
      AssemblyBridge.configure({
        additionalOrigins: [`https://${cleanUrl}`],
      });
      bridgeConfigured = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

/**
 * Configuration for a clickable item (breadcrumb, CTA, or action menu item).
 */
interface Clickable {
  label: string;
  onClick?: () => void;
  icon?: Icon;
}

/**
 * React hook to set breadcrumb navigation items in the header.
 * Items are automatically cleared when the component unmounts.
 *
 * @param breadcrumbs - Array of breadcrumb items with labels and optional click handlers
 *
 * @example
 * useBreadcrumbs([
 *   { label: 'Home' },
 *   { label: 'Settings', onClick: () => router.push('/settings') }
 * ]);
 */
export function useBreadcrumbs(breadcrumbs: Clickable[]) {
  // Use a ref to store the latest callbacks without triggering re-renders
  const callbacksRef = useRef<Map<string, (() => void) | undefined>>(new Map());

  // Create a stable key based on labels only
  const labelsKey = breadcrumbs.map((b) => b.label).join('\0');

  // Update the callbacks ref on each render
  callbacksRef.current.clear();
  breadcrumbs.forEach((b) => {
    callbacksRef.current.set(b.label, b.onClick);
  });

  const items: BreadcrumbItem[] = useMemo(
    () =>
      breadcrumbs.map(({ label }) => ({
        label,
        onClick: () => callbacksRef.current.get(label)?.(),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [labelsKey],
  );

  // Send breadcrumbs when items change
  useEffect(() => {
    AssemblyBridge.header.setBreadcrumbs(items);
  }, [items]);

  // Separate cleanup effect that only runs on unmount
  useEffect(() => {
    return () => {
      AssemblyBridge.header.setBreadcrumbs([]);
    };
  }, []);
}

/**
 * React hook to set the primary CTA button in the header.
 * The button is automatically cleared when the component unmounts.
 *
 * @param config - CTA configuration with label, optional icon, and click handler, or null to clear
 *
 * @example
 * usePrimaryCta({
 *   label: 'Save',
 *   icon: 'Check',
 *   onClick: () => handleSave()
 * });
 */
export function usePrimaryCta(config: Clickable | null) {
  const callbackRef = useRef<(() => void) | undefined>(undefined);
  callbackRef.current = config?.onClick;

  // Create a stable key based on label and icon only
  const configKey = config ? `${config.label}\0${config.icon ?? ''}` : null;

  const ctaConfig: CtaConfig | null = useMemo(() => {
    if (!config || !config.onClick) return null;
    return {
      label: config.label,
      icon: config.icon as CtaIcon | undefined,
      onClick: () => callbackRef.current?.(),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configKey]);

  useEffect(() => {
    AssemblyBridge.header.setPrimaryCta(ctaConfig);
    return () => {
      AssemblyBridge.header.setPrimaryCta(null);
    };
  }, [ctaConfig]);
}

/**
 * React hook to set the secondary CTA button in the header.
 * The button is automatically cleared when the component unmounts.
 *
 * @param config - CTA configuration with label, optional icon, and click handler, or null to clear
 *
 * @example
 * useSecondaryCta({
 *   label: 'Cancel',
 *   onClick: () => handleCancel()
 * });
 */
export function useSecondaryCta(config: Clickable | null) {
  const callbackRef = useRef<(() => void) | undefined>(undefined);
  callbackRef.current = config?.onClick;

  // Create a stable key based on label and icon only
  const configKey = config ? `${config.label}\0${config.icon ?? ''}` : null;

  const ctaConfig: CtaConfig | null = useMemo(() => {
    if (!config || !config.onClick) return null;
    return {
      label: config.label,
      icon: config.icon as CtaIcon | undefined,
      onClick: () => callbackRef.current?.(),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configKey]);

  useEffect(() => {
    AssemblyBridge.header.setSecondaryCta(ctaConfig);
    return () => {
      AssemblyBridge.header.setSecondaryCta(null);
    };
  }, [ctaConfig]);
}

/**
 * React hook to set the actions dropdown menu in the header.
 * The menu is automatically cleared when the component unmounts.
 *
 * @param actions - Array of action items with labels, optional icons, and click handlers
 *
 * @example
 * useActionsMenu([
 *   { label: 'Archive', icon: 'Archive', onClick: () => handleArchive() },
 *   { label: 'Delete', icon: 'Trash', onClick: () => handleDelete() }
 * ]);
 */
export function useActionsMenu(actions: Clickable[]) {
  // Use a ref to store the latest callbacks without triggering re-renders
  const callbacksRef = useRef<Map<string, () => void>>(new Map());

  // Create a stable key based on labels and icons only
  const actionsKey = actions
    .filter((a) => a.onClick !== undefined)
    .map((a) => `${a.label}\0${a.icon ?? ''}`)
    .join('\n');

  // Update the callbacks ref on each render
  callbacksRef.current.clear();
  actions.forEach((a) => {
    if (a.onClick) {
      callbacksRef.current.set(a.label, a.onClick);
    }
  });

  const items: ActionMenuItem[] = useMemo(
    () =>
      actions
        .filter((action) => action.onClick !== undefined)
        .map(({ label, icon }) => ({
          label,
          icon,
          onClick: () => callbacksRef.current.get(label)?.(),
        })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [actionsKey],
  );

  useEffect(() => {
    AssemblyBridge.header.setActionsMenu(items);
    return () => {
      AssemblyBridge.header.setActionsMenu([]);
    };
  }, [items]);
}
