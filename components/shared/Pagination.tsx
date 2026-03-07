'use client';

import { Button } from '@assembly-js/design-system';

interface PaginationProps {
  nextToken?: string;
  onPageChange: (nextToken: string) => void;
}

export function Pagination({ nextToken, onPageChange }: PaginationProps) {
  if (!nextToken) return null;

  return (
    <div className="flex justify-end pt-4">
      <Button
        variant="secondary"
        label="Next"
        onClick={() => onPageChange(nextToken)}
      />
    </div>
  );
}
