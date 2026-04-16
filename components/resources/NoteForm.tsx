'use client';

import { useForm } from 'react-hook-form';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

  const form = useForm<FormValues>({
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          rules={{ required: 'Title is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && (
          <p className="text-sm text-red-600">
            {error.message}
          </p>
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
    </Form>
  );
}
