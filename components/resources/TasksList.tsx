'use client';

import { useState } from 'react';
import { Icon } from '@assembly-js/design-system';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import { useApi, useApiMutation } from '@/hooks/useApi';
import { useToken } from '@/app/providers/TokenProvider';
import { TaskForm } from './TaskForm';
import { EmptyState } from '@/components/shared/EmptyState';

interface TaskItem {
  id?: string;
  name?: string;
  description?: string;
  status?: string;
  createdDate?: string;
  dueDate?: string;
  clientId?: string;
  companyId?: string;
}

interface TasksResponse {
  data?: TaskItem[];
  nextToken?: string;
}

interface TasksListProps {
  entityType: 'client' | 'company';
  entityId: string;
}

const STATUS_MAP: Record<string, { label: string; className: string }> = {
  todo: { label: 'To Do', className: 'bg-gray-50 text-gray-700 border-gray-200' },
  inProgress: { label: 'In Progress', className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  completed: { label: 'Completed', className: 'bg-green-50 text-green-700 border-green-200' },
};

export function TasksList({ entityType, entityId }: TasksListProps) {
  const token = useToken();
  const entityParam = entityType === 'client' ? 'clientId' : 'companyId';
  const { data, isLoading, mutate } = useApi<TasksResponse>('/api/tasks', {
    [entityParam]: entityId,
  });
  const { trigger: updateTrigger } = useApiMutation('/api/tasks');
  const [showCreateForm, setShowCreateForm] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="size-5" />
      </div>
    );
  }

  const tasks = (data?.data ?? []).filter(
    (t): t is TaskItem & { id: string; name: string } => !!t.id && !!t.name,
  );

  if (tasks.length === 0) {
    return (
      <>
        <EmptyState
          icon="Tasks"
          message="No tasks yet"
          description="Create your first task to get started."
          actionLabel="Add Task"
          onAction={() => setShowCreateForm(true)}
        />
        <TaskDialog
          open={showCreateForm}
          onOpenChange={setShowCreateForm}
          entityType={entityType}
          entityId={entityId}
          onSuccess={mutate}
        />
      </>
    );
  }

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await updateTrigger('PUT', { id: taskId, status: newStatus });
      mutate();
    } catch {
      // error handled by hook
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await fetch(`/api/tasks?id=${encodeURIComponent(taskId)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      mutate();
    } catch {
      // error handled
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
          + Add Task
        </button>
      </div>
      {tasks.map((task) => {
        const statusInfo = STATUS_MAP[task.status ?? 'todo'] ?? STATUS_MAP.todo;
        return (
          <div
            key={task.id}
            className="flex items-center gap-3 p-4 border border-gray-100 rounded-lg hover:bg-gray-50"
          >
            <div className="flex-1 min-w-0">
              <p className="text-base">{task.name}</p>
              {task.description && (
                <p className="text-sm text-gray-500 mt-0.5">
                  {task.description}
                </p>
              )}
            </div>
            <Select.Root
              value={task.status ?? 'todo'}
              onValueChange={(value) => handleStatusChange(task.id, value)}
            >
              <Select.Trigger className="inline-flex items-center gap-1 px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50">
                <Badge variant="outline" className={statusInfo.className}>
                  {statusInfo.label}
                </Badge>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="bg-white border border-gray-200 rounded-md shadow-lg p-1 z-50">
                  <Select.Viewport>
                    <Select.Item
                      value="todo"
                      className="px-3 py-1.5 text-sm cursor-pointer hover:bg-gray-50 rounded outline-none data-[highlighted]:bg-gray-50"
                    >
                      <Select.ItemText>To Do</Select.ItemText>
                    </Select.Item>
                    <Select.Item
                      value="inProgress"
                      className="px-3 py-1.5 text-sm cursor-pointer hover:bg-gray-50 rounded outline-none data-[highlighted]:bg-gray-50"
                    >
                      <Select.ItemText>In Progress</Select.ItemText>
                    </Select.Item>
                    <Select.Item
                      value="completed"
                      className="px-3 py-1.5 text-sm cursor-pointer hover:bg-gray-50 rounded outline-none data-[highlighted]:bg-gray-50"
                    >
                      <Select.ItemText>Completed</Select.ItemText>
                    </Select.Item>
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              aria-label="Delete"
              onClick={() => handleDelete(task.id)}
            >
              <Icon icon="Trash" />
            </Button>
          </div>
        );
      })}

      <TaskDialog
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
        entityType={entityType}
        entityId={entityId}
        onSuccess={mutate}
      />
    </div>
  );
}

function TaskDialog({
  open,
  onOpenChange,
  entityType,
  entityId,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entityType: 'client' | 'company';
  entityId: string;
  onSuccess: () => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md shadow-lg z-50">
          <Dialog.Title asChild>
            <h2 className="text-sm font-semibold tracking-tight">
              Create Task
            </h2>
          </Dialog.Title>
          <div className="mt-4">
            <TaskForm
              entityType={entityType}
              entityId={entityId}
              onClose={() => onOpenChange(false)}
              onSuccess={onSuccess}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
