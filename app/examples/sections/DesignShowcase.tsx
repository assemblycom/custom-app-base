'use client';

import { Body, Heading, Button, Icon } from '@assembly-js/design-system';

function ShowcaseCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <Body size="sm" className="text-gray-500 mb-3 font-medium">
        {title}
      </Body>
      {children}
    </div>
  );
}

export function DesignShowcase() {
  return (
    <section>
      <div className="mb-4">
        <Heading size="xl">Design System</Heading>
        <Body size="base" className="text-gray-500 mt-1">
          A sampling of components from @assembly-js/design-system
        </Body>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ShowcaseCard title="Typography">
          <div>
            <Heading size="3xl">Heading 3xl</Heading>
            <Heading size="2xl">Heading 2xl</Heading>
            <Heading size="xl">Heading xl</Heading>
            <Body size="lg">Body large</Body>
            <Body size="base">Body base</Body>
            <Body size="sm">Body small</Body>
          </div>
        </ShowcaseCard>

        <ShowcaseCard title="Buttons">
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" label="Primary" />
            <Button variant="secondary" label="Secondary" />
            <Button variant="text" label="Text" />
            <Button variant="primary" size="sm" label="Small" />
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
          <Body size="base" className="mb-3">
            Explore all available components in Storybook.
          </Body>
          <a
            href="https://main--6639299038cefd2601c9e48a.chromatic.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
          >
            <Body size="base">Open Storybook</Body>
            <Icon icon="ArrowNE" className="w-4 h-4" />
          </a>
        </ShowcaseCard>
      </div>
    </section>
  );
}
