'use client';

import { useState, useCallback } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import * as Dialog from '@radix-ui/react-dialog';
import { Heading } from '@assembly-js/design-system';
import { usePrimaryCta } from '@/bridge/hooks';
import { NotesList } from '@/components/resources/NotesList';
import { NoteForm } from '@/components/resources/NoteForm';
import { TasksList } from '@/components/resources/TasksList';
import { TaskForm } from '@/components/resources/TaskForm';
import { FilesList } from '@/components/resources/FilesList';

interface ResourceTabsProps {
  entityType: 'client' | 'company';
  entityId: string;
  channelId?: string;
}

type TabValue = 'notes' | 'tasks' | 'files';

export function ResourceTabs({
  entityType,
  entityId,
  channelId,
}: ResourceTabsProps) {
  const [activeTab, setActiveTab] = useState<TabValue>('notes');
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [showTaskDialog, setShowTaskDialog] = useState(false);

  const ctaConfig = {
    notes: {
      label: 'Add Note',
      icon: 'Plus' as const,
      onClick: () => setShowNoteDialog(true),
    },
    tasks: {
      label: 'Add Task',
      icon: 'Plus' as const,
      onClick: () => setShowTaskDialog(true),
    },
    files: null,
  };

  usePrimaryCta(ctaConfig[activeTab]);

  const handleNoteSuccess = useCallback(() => {
    // SWR will revalidate via the NoteForm's mutation hook
  }, []);

  const handleTaskSuccess = useCallback(() => {
    // SWR will revalidate via the TaskForm's mutation hook
  }, []);

  return (
    <div>
      <Tabs.Root
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as TabValue)}
      >
        <Tabs.List className="flex border-b border-gray-200 mb-6">
          <Tabs.Trigger
            value="notes"
            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
          >
            Notes
          </Tabs.Trigger>
          <Tabs.Trigger
            value="tasks"
            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
          >
            Tasks
          </Tabs.Trigger>
          <Tabs.Trigger
            value="files"
            className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
          >
            Files
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="notes">
          <NotesList entityType={entityType} entityId={entityId} />
        </Tabs.Content>
        <Tabs.Content value="tasks">
          <TasksList entityType={entityType} entityId={entityId} />
        </Tabs.Content>
        <Tabs.Content value="files">
          <FilesList
            entityType={entityType}
            entityId={entityId}
            channelId={channelId}
          />
        </Tabs.Content>
      </Tabs.Root>

      {/* Note create dialog triggered by bridge CTA */}
      <Dialog.Root open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md shadow-lg z-50">
            <Dialog.Title asChild>
              <Heading size="sm" tag="h2">
                Create Note
              </Heading>
            </Dialog.Title>
            <div className="mt-4">
              <NoteForm
                entityType={entityType}
                entityId={entityId}
                onClose={() => setShowNoteDialog(false)}
                onSuccess={handleNoteSuccess}
              />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Task create dialog triggered by bridge CTA */}
      <Dialog.Root open={showTaskDialog} onOpenChange={setShowTaskDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md shadow-lg z-50">
            <Dialog.Title asChild>
              <Heading size="sm" tag="h2">
                Create Task
              </Heading>
            </Dialog.Title>
            <div className="mt-4">
              <TaskForm
                entityType={entityType}
                entityId={entityId}
                onClose={() => setShowTaskDialog(false)}
                onSuccess={handleTaskSuccess}
              />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
