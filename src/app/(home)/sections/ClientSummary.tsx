'use client';

import { useState, useEffect, useCallback } from 'react';
import { Body, Heading } from '@assembly-js/design-system';
import { useToken } from '@/app/providers/TokenProvider';

interface ClientData {
  id: string;
  givenName?: string;
  familyName?: string;
  email?: string;
  avatarImageUrl?: string;
  status?: string;
  companyId?: string;
  createdAt?: string;
  lastLoginAt?: string;
  customFields?: Record<
    string,
    {
      type?: string;
      label?: string;
      value?: unknown;
    }
  >;
}

interface CompanyData {
  id: string;
  name?: string;
  iconImageUrl?: string;
}

function Avatar({
  src,
  name,
  size = 'lg',
}: {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-20 h-20 text-2xl',
  }[size];

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClasses} rounded-full object-cover`}
      />
    );
  }

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`${sizeClasses} rounded-full bg-slate-200 flex items-center justify-center font-medium text-slate-600`}
    >
      {initials}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    invited: 'bg-amber-50 text-amber-700 border-amber-200',
    not_invited: 'bg-slate-50 text-slate-600 border-slate-200',
  };

  const labels: Record<string, string> = {
    active: 'Active',
    invited: 'Invited',
    not_invited: 'Not Invited',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] ?? styles.not_invited}`}
    >
      {labels[status] ?? status}
    </span>
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-b-0">
      <Body size="sm" className="text-slate-500 w-32 shrink-0 pt-0.5">
        {label}
      </Body>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function formatDate(dateString?: string) {
  if (!dateString) return null;
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return null;
  }
}

function CustomFieldValue({ field }: { field: { type?: string; label?: string; value?: unknown } }) {
  const { type, value } = field;

  if (value === null || value === undefined || value === '') return null;

  if (type === 'url' && typeof value === 'string') {
    return (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-700 underline break-all"
      >
        {value}
      </a>
    );
  }

  if (type === 'tags' && Array.isArray(value)) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {value.map((tag, i) => (
          <span
            key={i}
            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700"
          >
            {String(tag)}
          </span>
        ))}
      </div>
    );
  }

  if (type === 'address' && typeof value === 'object') {
    const addr = value as Record<string, string>;
    const parts = [addr.street, addr.city, addr.state, addr.zip, addr.country].filter(Boolean);
    return <Body size="sm">{parts.join(', ')}</Body>;
  }

  return <Body size="sm">{String(value)}</Body>;
}

interface ClientSummaryProps {
  client?: ClientData;
  company?: CompanyData | null;
  isInternalUser?: boolean;
}

export function ClientSummary({ client, company, isInternalUser = false }: ClientSummaryProps) {
  const token = useToken();
  const [notes, setNotes] = useState('');
  const [savedNotes, setSavedNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(false);

  const clientName = client
    ? [client.givenName, client.familyName].filter(Boolean).join(' ') || 'Unknown Client'
    : 'Unknown Client';

  const fetchNotes = useCallback(async () => {
    if (!client?.id || !isInternalUser) return;
    setLoadingNotes(true);
    try {
      const res = await fetch(`/api/clients/${client.id}/notes?token=${encodeURIComponent(token)}`);
      const json = await res.json();
      if (json.success) {
        setNotes(json.data.notes);
        setSavedNotes(json.data.notes);
      }
    } catch {
      // Silently fail on notes load
    } finally {
      setLoadingNotes(false);
    }
  }, [client?.id, isInternalUser, token]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const saveNotes = async () => {
    if (!client?.id) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/clients/${client.id}/notes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      const json = await res.json();
      if (json.success) {
        setSavedNotes(json.data.notes);
      }
    } catch {
      // Silently fail
    } finally {
      setSaving(false);
    }
  };

  if (!client) {
    return (
      <div className="flex items-center justify-center py-16">
        <Body size="base" className="text-slate-400">
          No client data available
        </Body>
      </div>
    );
  }

  const hasUnsavedChanges = notes !== savedNotes;

  const customFields = client.customFields
    ? Object.entries(client.customFields).filter(
        ([, field]) => field.value !== null && field.value !== undefined && field.value !== '',
      )
    : [];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-start gap-5">
        <Avatar src={client.avatarImageUrl} name={clientName} size="lg" />
        <div className="min-w-0 flex-1 pt-1">
          <div className="flex items-center gap-3 mb-1">
            <Heading size="xl" className="truncate">
              {clientName}
            </Heading>
            {client.status && <StatusBadge status={client.status} />}
          </div>
          {client.email && (
            <Body size="base" className="text-slate-500 truncate">
              {client.email}
            </Body>
          )}
        </div>
      </div>

      {/* Details Card */}
      <div className="bg-white rounded-lg border border-slate-200 p-5">
        <Heading size="base" className="mb-3">
          Details
        </Heading>
        <div>
          {company?.name && (
            <InfoRow label="Company">
              <div className="flex items-center gap-2">
                {company.iconImageUrl ? (
                  <img
                    src={company.iconImageUrl}
                    alt={company.name}
                    className="w-5 h-5 rounded object-contain"
                  />
                ) : null}
                <Body size="sm">{company.name}</Body>
              </div>
            </InfoRow>
          )}
          {client.email && (
            <InfoRow label="Email">
              <Body size="sm">{client.email}</Body>
            </InfoRow>
          )}
          {formatDate(client.createdAt) && (
            <InfoRow label="Created">
              <Body size="sm">{formatDate(client.createdAt)}</Body>
            </InfoRow>
          )}
          {formatDate(client.lastLoginAt) && (
            <InfoRow label="Last Login">
              <Body size="sm">{formatDate(client.lastLoginAt)}</Body>
            </InfoRow>
          )}
        </div>
      </div>

      {/* Custom Fields */}
      {customFields.length > 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-5">
          <Heading size="base" className="mb-3">
            Additional Information
          </Heading>
          <div>
            {customFields.map(([key, field]) => (
              <InfoRow key={key} label={field.label ?? key}>
                <CustomFieldValue field={field} />
              </InfoRow>
            ))}
          </div>
        </div>
      )}

      {/* Notes Section - internal users only */}
      {isInternalUser && (
        <div className="bg-white rounded-lg border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <Heading size="base">Notes</Heading>
            {hasUnsavedChanges && (
              <Body size="sm" className="text-amber-600">
                Unsaved changes
              </Body>
            )}
          </div>
          {loadingNotes ? (
            <div className="h-32 flex items-center justify-center">
              <Body size="sm" className="text-slate-400">
                Loading notes...
              </Body>
            </div>
          ) : (
            <>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this client..."
                className="w-full h-32 px-3 py-2 text-sm border border-slate-200 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-400"
              />
              <div className="flex justify-end mt-3">
                <button
                  onClick={saveNotes}
                  disabled={saving || !hasUnsavedChanges}
                  className="px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? 'Saving...' : 'Save Notes'}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
