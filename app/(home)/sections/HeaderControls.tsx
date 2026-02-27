'use client';

import { useState } from 'react';
import {
  useActionsMenu,
  useBreadcrumbs,
  usePrimaryCta,
  useSecondaryCta,
} from '@/bridge/hooks';
import { Body, Heading, IconButton, Button } from '@assembly-js/design-system';

function EditableTag({
  value,
  onChange,
  onRemove,
  removeLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  removeLabel: string;
}) {
  return (
    <div className="bg-slate-100 flex flex-row rounded whitespace-nowrap">
      <input
        className="text-sm bg-transparent px-3 py-1.5 w-24 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-l"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <IconButton onClick={onRemove} icon="Close" label={removeLabel} />
    </div>
  );
}

function ControlRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 py-3 border-b border-gray-100 last:border-b-0">
      <Body size="sm" className="text-gray-500 font-medium">
        {label}
      </Body>
      <div className="flex flex-row flex-wrap gap-2">{children}</div>
    </div>
  );
}

export function HeaderControls() {
  const [breadcrumbValues, setBreadcrumbValues] = useState<string[]>(['Home']);
  const [actionsMenuItems, setActionsMenuItems] = useState<string[]>([]);
  const [primaryCta, setPrimaryCta] = useState<string>('');
  const [secondaryCta, setSecondaryCta] = useState<string>('');

  useBreadcrumbs(
    breadcrumbValues.map((value) => ({
      label: value,
      onClick: () => alert(`Clicked: ${value}`),
    })),
  );

  useActionsMenu(
    actionsMenuItems.map((value) => ({
      icon: 'Plus',
      label: value,
      onClick: () => alert(`Clicked: ${value}`),
    })),
  );

  usePrimaryCta(
    primaryCta
      ? {
          label: primaryCta,
          onClick: () => alert(`Clicked: ${primaryCta}`),
        }
      : null,
  );

  useSecondaryCta(
    secondaryCta
      ? {
          label: secondaryCta,
          onClick: () => alert(`Clicked: ${secondaryCta}`),
        }
      : null,
  );

  return (
    <section>
      <div className="mb-4">
        <Heading size="xl">Header Controls</Heading>
        <Body size="base" className="text-gray-500 mt-1">
          Manipulate the platform header above in real-time
        </Body>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <ControlRow label="Breadcrumbs">
          {breadcrumbValues.map((value, index) => (
            <EditableTag
              key={`breadcrumb-${index}`}
              value={value}
              onChange={(newValue) => {
                setBreadcrumbValues((prev) => {
                  const updated = [...prev];
                  updated[index] = newValue;
                  return updated;
                });
              }}
              onRemove={() => {
                setBreadcrumbValues((prev) => prev.filter((_, i) => i !== index));
              }}
              removeLabel="Remove breadcrumb"
            />
          ))}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setBreadcrumbValues((prev) => [
                ...prev,
                `Page ${prev.length + 1}`,
              ]);
            }}
            label="Add"
          />
        </ControlRow>

        <ControlRow label="Actions Menu">
          {actionsMenuItems.map((value, index) => (
            <EditableTag
              key={`action-${index}`}
              value={value}
              onChange={(newValue) => {
                setActionsMenuItems((prev) => {
                  const updated = [...prev];
                  updated[index] = newValue;
                  return updated;
                });
              }}
              onRemove={() => {
                setActionsMenuItems((prev) => prev.filter((_, i) => i !== index));
              }}
              removeLabel="Remove action"
            />
          ))}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              setActionsMenuItems((prev) => [
                ...prev,
                `Action ${prev.length + 1}`,
              ]);
            }}
            label="Add"
          />
        </ControlRow>

        <ControlRow label="Primary CTA">
          <div className="flex flex-row bg-slate-100 rounded">
            <input
              className="text-sm bg-transparent py-1.5 px-3 w-32 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-l"
              placeholder="Button label..."
              value={primaryCta}
              onChange={(e) => setPrimaryCta(e.target.value)}
            />
            {primaryCta && (
              <IconButton
                onClick={() => setPrimaryCta('')}
                icon="Close"
                label="Clear primary CTA"
              />
            )}
          </div>
        </ControlRow>

        <ControlRow label="Secondary CTA">
          <div className="flex flex-row bg-slate-100 rounded">
            <input
              className="text-sm bg-transparent py-1.5 px-3 w-32 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-l"
              placeholder="Button label..."
              value={secondaryCta}
              onChange={(e) => setSecondaryCta(e.target.value)}
            />
            {secondaryCta && (
              <IconButton
                onClick={() => setSecondaryCta('')}
                icon="Close"
                label="Clear secondary CTA"
              />
            )}
          </div>
        </ControlRow>
      </div>
    </section>
  );
}
