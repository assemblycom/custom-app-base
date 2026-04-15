'use client';

import { useState } from 'react';
import { Body, Heading, IconButton } from '@assembly-js/design-system';
import { Spinner } from '@/components/ui/spinner';
import * as Dialog from '@radix-ui/react-dialog';
import { formatDistanceToNow } from 'date-fns';
import { useApi } from '@/hooks/useApi';
import { useToken } from '@/app/providers/TokenProvider';
import { NoteForm } from './NoteForm';
import { EmptyState } from '@/components/shared/EmptyState';

interface NoteItem {
  id?: string;
  title?: string;
  content?: string;
  createdAt?: string;
  creatorId?: string;
  entityId?: string;
  entityType?: string;
  updatedAt?: string;
}

interface NotesResponse {
  data?: NoteItem[];
  nextToken?: string;
}

interface NotesListProps {
  entityType: 'client' | 'company';
  entityId: string;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

export function NotesList({ entityType, entityId }: NotesListProps) {
  const { data, isLoading, mutate } = useApi<NotesResponse>('/api/notes', {
    entityType,
    entityId,
  });
  const token = useToken();
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingNote, setEditingNote] = useState<{
    id: string;
    title: string;
    content?: string;
  } | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="size-5" />
      </div>
    );
  }

  const notes = (data?.data ?? []).filter(
    (n): n is NoteItem & { id: string; title: string } =>
      !!n.id && !!n.title,
  );

  if (notes.length === 0) {
    return (
      <>
        <EmptyState
          icon="Message"
          message="No notes yet"
          description="Create your first note to get started."
          actionLabel="Add Note"
          onAction={() => setShowCreateForm(true)}
        />
        <NoteDialog
          open={showCreateForm}
          onOpenChange={setShowCreateForm}
          entityType={entityType}
          entityId={entityId}
          onSuccess={mutate}
        />
      </>
    );
  }

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await fetch(`/api/notes?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      mutate();
    } catch {
      // error handled
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-end mb-4">
        <button
          type="button"
          className="text-sm text-blue-600 hover:text-blue-800"
          onClick={() => setShowCreateForm(true)}
        >
          + Add Note
        </button>
      </div>
      {notes.map((note) => (
        <div
          key={note.id}
          className="flex items-start gap-3 p-4 border border-gray-100 rounded-lg hover:bg-gray-50"
        >
          <div className="flex-1 min-w-0">
            <Heading size="2xs" tag="h4">
              {note.title}
            </Heading>
            {note.content && (
              <Body size="sm" className="text-gray-600 mt-1 line-clamp-2">
                {stripHtml(note.content).slice(0, 120)}
              </Body>
            )}
            {note.createdAt && (
              <Body size="xs" className="text-gray-400 mt-1">
                {formatDistanceToNow(new Date(note.createdAt), {
                  addSuffix: true,
                })}
              </Body>
            )}
          </div>
          <div className="flex gap-1 shrink-0">
            <IconButton
              icon="Edit"
              label="Edit"
              variant="minimal"
              size="sm"
              onClick={() =>
                setEditingNote({
                  id: note.id,
                  title: note.title,
                  content: note.content,
                })
              }
            />
            <IconButton
              icon="Trash"
              label="Delete"
              variant="minimal"
              size="sm"
              disabled={isDeleting}
              onClick={() => handleDelete(note.id)}
            />
          </div>
        </div>
      ))}

      <NoteDialog
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
        entityType={entityType}
        entityId={entityId}
        onSuccess={mutate}
      />

      <NoteDialog
        open={!!editingNote}
        onOpenChange={(open) => !open && setEditingNote(null)}
        entityType={entityType}
        entityId={entityId}
        note={editingNote ?? undefined}
        onSuccess={mutate}
      />
    </div>
  );
}

function NoteDialog({
  open,
  onOpenChange,
  entityType,
  entityId,
  note,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: 'client' | 'company';
  entityId: string;
  note?: { id: string; title: string; content?: string };
  onSuccess: () => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md shadow-lg z-50">
          <Dialog.Title asChild>
            <Heading size="sm" tag="h2">
              {note ? 'Edit Note' : 'Create Note'}
            </Heading>
          </Dialog.Title>
          <div className="mt-4">
            <NoteForm
              entityType={entityType}
              entityId={entityId}
              note={note}
              onClose={() => onOpenChange(false)}
              onSuccess={onSuccess}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
