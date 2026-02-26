'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Body, Heading } from '@assembly-js/design-system';
import { useToken } from '@/app/providers/TokenProvider';
import { useBreadcrumbs } from '@/bridge/hooks';
import { ClientSummary } from './ClientSummary';

interface ClientListItem {
  id: string;
  givenName?: string;
  familyName?: string;
  email?: string;
  avatarImageUrl?: string;
  status?: string;
  companyId?: string;
  createdAt?: string;
  lastLoginAt?: string;
  customFields?: Record<string, { type?: string; label?: string; value?: unknown }>;
}

interface ClientDetailData {
  client: ClientListItem;
  company: { id: string; name?: string; iconImageUrl?: string } | null;
}

function Avatar({ src, name }: { src?: string; name: string }) {
  if (src) {
    return (
      <img src={src} alt={name} className="w-9 h-9 rounded-full object-cover shrink-0" />
    );
  }

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium text-slate-600 shrink-0">
      {initials}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      className="w-4 h-4 text-slate-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    </svg>
  );
}

function ChevronLeftIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  );
}

function getClientName(client: ClientListItem) {
  return [client.givenName, client.familyName].filter(Boolean).join(' ') || 'Unknown Client';
}

export function ClientPicker() {
  const token = useToken();
  const [clients, setClients] = useState<ClientListItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<ClientDetailData | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedClientName = selectedClient
    ? getClientName(selectedClient.client)
    : null;

  useBreadcrumbs(
    selectedClientName
      ? [
          { label: 'Clients', onClick: () => handleBack() },
          { label: selectedClientName },
        ]
      : [{ label: 'Clients' }],
  );

  const fetchClients = useCallback(
    async (query: string) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ token });
        if (query.trim()) params.set('search', query.trim());
        const res = await fetch(`/api/clients?${params.toString()}`);
        const json = await res.json();
        if (json.success) {
          setClients(json.data);
        } else {
          setError(json.error ?? 'Failed to load clients');
        }
      } catch {
        setError('Failed to load clients');
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  useEffect(() => {
    fetchClients('');
  }, [fetchClients]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchClients(search);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search, fetchClients]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectClient = async (client: ClientListItem) => {
    setIsOpen(false);
    setLoadingDetail(true);
    try {
      const res = await fetch(`/api/clients/${client.id}?token=${encodeURIComponent(token)}`);
      const json = await res.json();
      if (json.success) {
        setSelectedClient(json.data);
      } else {
        setError(json.error ?? 'Failed to load client details');
      }
    } catch {
      setError('Failed to load client details');
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleBack = () => {
    setSelectedClient(null);
    setSearch('');
  };

  // Show client detail view
  if (selectedClient) {
    return (
      <div>
        <button
          onClick={handleBack}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-5"
        >
          <ChevronLeftIcon />
          <span>Back to clients</span>
        </button>
        <ClientSummary
          client={selectedClient.client}
          company={selectedClient.company}
          isInternalUser={true}
        />
      </div>
    );
  }

  // Loading detail view
  if (loadingDetail) {
    return (
      <div className="flex items-center justify-center py-16">
        <Body size="base" className="text-slate-400">
          Loading client...
        </Body>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Heading size="xl">Client Preview</Heading>
        <Body size="base" className="text-slate-500 mt-1">
          Select a client to view their summary
        </Body>
      </div>

      {/* Searchable dropdown */}
      <div ref={dropdownRef} className="relative max-w-md">
        <div
          className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-lg bg-white cursor-text hover:border-slate-300 transition-colors"
          onClick={() => setIsOpen(true)}
        >
          <SearchIcon />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search clients by name or email..."
            className="flex-1 text-sm bg-transparent outline-none placeholder:text-slate-400"
          />
        </div>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-72 overflow-y-auto">
            {loading ? (
              <div className="px-4 py-8 text-center">
                <Body size="sm" className="text-slate-400">
                  Loading...
                </Body>
              </div>
            ) : error ? (
              <div className="px-4 py-8 text-center">
                <Body size="sm" className="text-red-500">
                  {error}
                </Body>
              </div>
            ) : clients.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Body size="sm" className="text-slate-400">
                  {search.trim() ? 'No clients match your search' : 'No clients found'}
                </Body>
              </div>
            ) : (
              <ul role="listbox" className="py-1">
                {clients.map((client) => {
                  const name = getClientName(client);
                  return (
                    <li
                      key={client.id}
                      role="option"
                      aria-selected={false}
                      onClick={() => selectClient(client)}
                      className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <Avatar src={client.avatarImageUrl} name={name} />
                      <div className="min-w-0 flex-1">
                        <Body size="sm" className="font-medium truncate">
                          {name}
                        </Body>
                        {client.email && (
                          <Body size="sm" className="text-slate-500 truncate">
                            {client.email}
                          </Body>
                        )}
                      </div>
                      {client.status && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                            client.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700'
                              : client.status === 'invited'
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-slate-50 text-slate-500'
                          }`}
                        >
                          {client.status === 'active'
                            ? 'Active'
                            : client.status === 'invited'
                              ? 'Invited'
                              : client.status}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
