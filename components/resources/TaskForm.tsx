'use client';

import { useForm } from 'react-hook-form';
import { Input, Textarea } from '@assembly-js/design-system';
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

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Task Name"
        {...register('name', { required: 'Task name is required' })}
        error={errors.name?.message}
      />
      <Textarea label="Description" {...register('description')} />
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
  );
}
