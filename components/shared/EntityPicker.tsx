'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
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
          <p className="text-sm text-gray-500">
            No results found
          </p>
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
                <p className="text-base">{entity.name}</p>
                {entity.detail && (
                  <p className="text-sm text-gray-500">
                    {entity.detail}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
