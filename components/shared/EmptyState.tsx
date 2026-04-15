'use client';

import { Icon, Heading, Body } from '@assembly-js/design-system';
import type { IconType } from '@assembly-js/design-system';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon: IconType;
  message: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon,
  message,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center gap-4">
      <Icon icon={icon} width={48} height={48} className="text-gray-400" />
      <Heading size="sm">{message}</Heading>
      <Body size="base" className="text-gray-500 max-w-md">
        {description}
      </Body>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
