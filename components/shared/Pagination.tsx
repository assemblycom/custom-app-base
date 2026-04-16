'use client';

import { Button } from '@/components/ui/button';

interface PaginationProps {
  nextToken?: string;
  onPageChange: (nextToken: string) => void;
}

export function Pagination({ nextToken, onPageChange }: PaginationProps) {
  if (!nextToken) return null;

  return (
    <div className="flex justify-end pt-4">
      <Button
        variant="outline"
        onClick={() => onPageChange(nextToken)}
      >
        Next
      </Button>
    </div>
  );
}
