'use client';

import { useState } from 'react';
import { Body, Input } from '@assembly-js/design-system';
import { Spinner } from '@/components/ui/spinner';

export interface Entity {
  id: string;
  name: string;
  detail?: string;
}

interface EntityPickerProps {
  entities: Entity[];
  onSelect: (entity: Entity) => void;
  isLoading?: boolean;
}

export function EntityPicker({
  entities,
  onSelect,
  isLoading,
}: EntityPickerProps) {
  const [search, setSearch] = useState('');

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="size-5" />
      </div>
    );
  }

  const filtered = search
    ? entities.filter((e) =>
        e.name.toLowerCase().includes(search.toLowerCase()),
      )
    : entities;

  return (
    <div className="space-y-3">
      <Input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {filtered.length === 0 ? (
        <div className="py-8 text-center">
          <Body size="sm" className="text-gray-500">
            No results found
          </Body>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {filtered.map((entity) => (
            <button
              key={entity.id}
              type="button"
              className="flex w-full items-center gap-3 px-3 py-3 text-left hover:bg-gray-50 rounded-md transition-colors"
              onClick={() => onSelect(entity)}
            >
              <div className="min-w-0 flex-1">
                <Body size="base">{entity.name}</Body>
                {entity.detail && (
                  <Body size="sm" className="text-gray-500">
                    {entity.detail}
                  </Body>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
