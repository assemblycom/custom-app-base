'use client';

import { Icon } from '@assembly-js/design-system';
import { Button } from '@/components/ui/button';

function ShowcaseCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <p className="text-sm text-gray-500 mb-3 font-medium">
        {title}
      </p>
      {children}
    </div>
  );
}

export function DesignShowcase() {
  return (
    <section>
      <div className="mb-4">
        <h2 className="text-xl font-semibold tracking-tight">Design System</h2>
        <p className="text-base text-gray-500 mt-1">
          A sampling of components from @assembly-js/design-system
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ShowcaseCard title="Typography">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">Heading 3xl</h2>
            <h2 className="text-2xl font-semibold tracking-tight">Heading 2xl</h2>
            <h2 className="text-xl font-semibold tracking-tight">Heading xl</h2>
            <p className="text-lg">Body large</p>
            <p className="text-base">Body base</p>
            <p className="text-sm">Body small</p>
          </div>
        </ShowcaseCard>

        <ShowcaseCard title="Buttons">
          <div className="flex flex-wrap gap-2">
            <Button>Primary</Button>
            <Button variant="outline">Secondary</Button>
            <Button variant="ghost">Text</Button>
            <Button size="sm">Small</Button>
          </div>
        </ShowcaseCard>

        <ShowcaseCard title="Icons">
          <div className="flex flex-wrap gap-3">
            <Icon icon="Plus" className="w-5 h-5" />
            <Icon icon="Check" className="w-5 h-5" />
            <Icon icon="Close" className="w-5 h-5" />
            <Icon icon="Settings" className="w-5 h-5" />
            <Icon icon="Search" className="w-5 h-5" />
            <Icon icon="Code" className="w-5 h-5" />
            <Icon icon="Edit" className="w-5 h-5" />
            <Icon icon="Trash" className="w-5 h-5" />
            <Icon icon="Download" className="w-5 h-5" />
            <Icon icon="Upload" className="w-5 h-5" />
            <Icon icon="Calendar" className="w-5 h-5" />
            <Icon icon="Email" className="w-5 h-5" />
            <Icon icon="Home" className="w-5 h-5" />
            <Icon icon="Star" className="w-5 h-5" />
            <Icon icon="Filter" className="w-5 h-5" />
            <Icon icon="Copy" className="w-5 h-5" />
            <Icon icon="Link" className="w-5 h-5" />
            <Icon icon="Send" className="w-5 h-5" />
            <Icon icon="Message" className="w-5 h-5" />
            <Icon icon="Notification" className="w-5 h-5" />
            <Icon icon="Profile" className="w-5 h-5" />
            <Icon icon="Building" className="w-5 h-5" />
            <Icon icon="File" className="w-5 h-5" />
            <Icon icon="Automation" className="w-5 h-5" />
            <Icon icon="ArrowNE" className="w-5 h-5" />
          </div>
        </ShowcaseCard>

        <ShowcaseCard title="Full Documentation">
          <p className="text-base mb-3">
            Explore all available components in Storybook.
          </p>
          <a
            href="https://main--6639299038cefd2601c9e48a.chromatic.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
          >
            <p className="text-base">Open Storybook</p>
            <Icon icon="ArrowNE" className="w-4 h-4" />
          </a>
        </ShowcaseCard>
      </div>
    </section>
  );
}
