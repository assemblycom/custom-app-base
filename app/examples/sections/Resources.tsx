'use client';

import { Body, Heading, Icon } from '@assembly-js/design-system';

const RESOURCES = [
  {
    title: 'Custom Apps Guide',
    description: 'Learn how to build and deploy custom apps for Assembly',
    href: 'https://docs.assembly.com/docs/custom-apps-overview',
  },
  {
    title: 'API Reference',
    description: 'Explore the full Assembly API documentation',
    href: 'https://docs.assembly.com/reference/getting-started-introduction',
  },
  {
    title: 'Experts Directory',
    description: 'Hire an expert or become one yourself',
    href: 'https://assembly.com/experts',
  },
];

function ResourceCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 hover:bg-gray-100 transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <Body size="base" className="font-medium">
            {title}
          </Body>
          <Body size="sm" className="text-gray-500 mt-1">
            {description}
          </Body>
        </div>
        <Icon icon="ArrowNE" className="w-4 h-4 text-gray-400 flex-shrink-0" />
      </div>
    </a>
  );
}

export function Resources() {
  return (
    <section>
      <div className="mb-4">
        <Heading size="xl">Resources</Heading>
        <Body size="base" className="text-gray-500 mt-1">
          Documentation and help for building on Assembly
        </Body>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {RESOURCES.map((resource) => (
          <ResourceCard key={resource.href} {...resource} />
        ))}
      </div>
    </section>
  );
}
