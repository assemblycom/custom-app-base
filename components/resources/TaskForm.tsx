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

interface TaskFormProps {
  entityType: 'client' | 'company';
  entityId: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormValues {
  name: string;
  description: string;
}

export function TaskForm({
  entityType,
  entityId,
  onClose,
  onSuccess,
}: TaskFormProps) {
  const { trigger, isMutating, error } = useApiMutation('/api/tasks');

  const form = useForm<FormValues>({
    defaultValues: { name: '', description: '' },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await trigger('POST', {
        name: values.name,
        description: values.description,
        [entityType === 'client' ? 'clientId' : 'companyId']: entityId,
        status: 'todo',
      });
      onSuccess();
      onClose();
    } catch {
      // error captured by hook
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          rules={{ required: 'Task name is required' }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
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
            Create Task
          </Button>
        </div>
      </form>
    </Form>
  );
}
