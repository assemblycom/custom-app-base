'use client';

import { useForm } from 'react-hook-form';
import { Button, Input, Textarea, Body } from '@assembly-js/design-system';
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
        <Body size="sm" className="text-red-600">
          {error.message}
        </Body>
      )}
      <div className="flex gap-2 justify-end pt-2">
        <Button
          variant="secondary"
          label="Cancel"
          onClick={onClose}
          type="button"
        />
        <Button label="Create Task" loading={isMutating} type="submit" />
      </div>
    </form>
  );
}
