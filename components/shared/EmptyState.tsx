'use client';

import type { SVGProps } from 'react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon: React.ComponentType<SVGProps<SVGSVGElement>>;
  message: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: IconComponent,
  message,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center gap-4">
      <IconComponent width={48} height={48} className="text-gray-400" />
      <h2 className="text-sm font-semibold tracking-tight">{message}</h2>
      <p className="text-base text-gray-500 max-w-md">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
