'use client';

import { useRef } from 'react';
import { Body, Icon } from '@assembly-js/design-system';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { formatDistanceToNow } from 'date-fns';
import { useApi, useApiMutation } from '@/hooks/useApi';
import { EmptyState } from '@/components/shared/EmptyState';

interface FileItem {
  id?: string;
  name?: string;
  path?: string;
  channelId?: string;
  createdAt?: string;
  updatedAt?: string;
  object?: string;
}

interface FilesResponse {
  data?: FileItem[];
  nextToken?: string;
}

interface FilesListProps {
  entityType: 'client' | 'company';
  entityId: string;
  channelId?: string;
}

export function FilesList({ channelId }: FilesListProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { trigger, isMutating } = useApiMutation('/api/files');

  const hasChannel = !!channelId;
  const { data, isLoading, mutate } = useApi<FilesResponse>(
    '/api/files',
    hasChannel ? { channelId: channelId! } : undefined,
  );

  if (!hasChannel) {
    return (
      <EmptyState
        icon="File"
        message="Files"
        description="File management requires a file channel. Configure file channels in your Assembly workspace."
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="size-5" />
      </div>
    );
  }

  const files = (data?.data ?? []).filter(
    (f): f is FileItem & { id: string; name: string } => !!f.id && !!f.name,
  );

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !channelId) return;

    try {
      await trigger('POST', {
        fileType: 'file',
        path: `/${file.name}`,
        channelId,
      });
      mutate();
    } catch {
      // error handled by hook
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (files.length === 0) {
    return (
      <>
        <EmptyState
          icon="File"
          message="No files yet"
          description="Upload your first file to get started."
          actionLabel="Upload File"
          onAction={() => fileInputRef.current?.click()}
        />
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleUpload}
        />
      </>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          size="sm"
          disabled={isMutating}
          onClick={() => fileInputRef.current?.click()}
        >
          {isMutating && <Spinner />}
          Upload File
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleUpload}
        />
      </div>
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center gap-3 p-4 border border-gray-100 rounded-lg hover:bg-gray-50"
        >
          <Icon icon="File" className="text-gray-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <Body size="base">{file.name}</Body>
            {file.createdAt && (
              <Body size="xs" className="text-gray-400">
                {formatDistanceToNow(new Date(file.createdAt), {
                  addSuffix: true,
                })}
              </Body>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
