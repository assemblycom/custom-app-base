'use client';

import { useForm } from 'react-hook-form';
import { Input, Textarea } from '@assembly-js/design-system';
import { Body } from '@assembly-js/design-system';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useApiMutation } from '@/hooks/useApi';

interface NoteFormProps {
  entityType: 'client' | 'company';
  entityId: string;
  note?: { id: string; title: string; content?: string };
  onClose: () => void;
  onSuccess: () => void;
}

interface FormValues {
  title: string;
  content: string;
}

export function NoteForm({
  entityType,
  entityId,
  note,
  onClose,
  onSuccess,
}: NoteFormProps) {
  const isEdit = !!note;
  const { trigger, isMutating, error } = useApiMutation('/api/notes');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: note?.title ?? '',
      content: note?.content ?? '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      if (isEdit) {
        await trigger('PUT', {
          id: note!.id,
          title: values.title,
          content: values.content,
        });
      } else {
        await trigger('POST', {
          entityType,
          entityId,
          title: values.title,
          content: values.content,
        });
      }
      onSuccess();
      onClose();
    } catch {
      // error is captured by the hook
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Title"
        {...register('title', { required: 'Title is required' })}
        error={errors.title?.message}
      />
      <Textarea label="Content" {...register('content')} />
      {error && (
        <Body size="sm" className="text-red-600">
          {error.message}
        </Body>
      )}
      <div className="flex gap-2 justify-end pt-2">
        <Button
          variant="outline"
          onClick={onClose}
          type="button"
        >
          Cancel
        </Button>
        <Button disabled={isMutating} type="submit">
          {isMutating && <Spinner />}
          {isEdit ? 'Update Note' : 'Create Note'}
        </Button>
      </div>
    </form>
  );
}
