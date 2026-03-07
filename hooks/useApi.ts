'use client';

import useSWR, { useSWRConfig } from 'swr';
import { useState, useCallback } from 'react';
import { useToken } from '@/app/providers/TokenProvider';

function buildUrl(endpoint: string, params?: Record<string, string>) {
  if (!params) return endpoint;
  const filtered = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== '',
  );
  if (filtered.length === 0) return endpoint;
  return `${endpoint}?${new URLSearchParams(filtered).toString()}`;
}

export function useApi<T>(
  endpoint: string,
  params?: Record<string, string>,
): {
  data: T | undefined;
  error: Error | undefined;
  isLoading: boolean;
  mutate: () => void;
} {
  const token = useToken();
  const url = buildUrl(endpoint, params);

  const fetcher = async (key: string) => {
    const res = await fetch(key, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(body.error || `Request failed with status ${res.status}`);
    }
    return res.json();
  };

  const { data, error, isLoading, mutate } = useSWR<T>(url, fetcher);

  return {
    data,
    error,
    isLoading,
    mutate: () => {
      mutate();
    },
  };
}

export function useApiMutation(endpoint: string): {
  trigger: (
    method: 'POST' | 'PUT' | 'DELETE',
    body?: unknown,
  ) => Promise<unknown>;
  isMutating: boolean;
  error: Error | undefined;
} {
  const token = useToken();
  const { mutate: globalMutate } = useSWRConfig();
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<Error | undefined>();

  const trigger = useCallback(
    async (method: 'POST' | 'PUT' | 'DELETE', body?: unknown) => {
      setIsMutating(true);
      setError(undefined);
      try {
        const headers: Record<string, string> = {
          Authorization: `Bearer ${token}`,
        };
        const init: RequestInit = { method, headers };

        if (body !== undefined) {
          headers['Content-Type'] = 'application/json';
          init.body = JSON.stringify(body);
        }

        const res = await fetch(endpoint, init);
        const data = await res
          .json()
          .catch(() => ({ error: 'Request failed' }));

        if (!res.ok) {
          throw new Error(
            data.error || `Request failed with status ${res.status}`,
          );
        }

        // Revalidate all SWR keys that start with this endpoint
        globalMutate(
          (key) => typeof key === 'string' && key.startsWith(endpoint),
          undefined,
          { revalidate: true },
        );

        return data;
      } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err));
        setError(e);
        throw e;
      } finally {
        setIsMutating(false);
      }
    },
    [token, endpoint, globalMutate],
  );

  return { trigger, isMutating, error };
}
