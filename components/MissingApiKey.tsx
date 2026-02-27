'use client';

import { Body, Heading, Icon } from '@assembly-js/design-system';
import { Container } from '@/components/Container';

export function MissingApiKey() {
  return (
    <Container className="max-w-screen-md">
      <div className="py-12">
        <div className="mb-8">
          <Heading size="2xl">API Key Required</Heading>
          <Body size="lg" className="text-gray-500 mt-2">
            To connect this app to Assembly, you need to create a Custom App and
            add your API key.
          </Body>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
                1
              </div>
              <div>
                <Heading size="base">Create a Custom App</Heading>
                <Body size="base" className="text-gray-500 mt-1">
                  In your Assembly workspace, go to{' '}
                  <strong>Settings &rarr; App Setup</strong> and click{' '}
                  <strong>Add App</strong>. Select <strong>Custom App</strong>{' '}
                  and give it a name.
                </Body>
                <Body size="sm" className="text-gray-400 mt-2">
                  You can leave the URLs blank for now - dev-mode handles local
                  development.
                </Body>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
                2
              </div>
              <div>
                <Heading size="base">Copy your API Key</Heading>
                <Body size="base" className="text-gray-500 mt-1">
                  After creating the app, you&apos;ll see your API key. Copy it
                  - you&apos;ll need it in the next step.
                </Body>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
                3
              </div>
              <div>
                <Heading size="base">Add to your environment</Heading>
                <Body size="base" className="text-gray-500 mt-2 mb-3">
                  <strong>For local development:</strong> Create a{' '}
                  <code className="bg-gray-200 px-1.5 py-0.5 rounded text-sm">
                    .env.local
                  </code>{' '}
                  file in your project root:
                </Body>
                <pre className="bg-gray-900 text-gray-100 p-3 rounded-md text-sm overflow-x-auto">
                  ASSEMBLY_API_KEY=your_api_key_here
                </pre>

                <Body size="base" className="text-gray-500 mt-4 mb-3">
                  <strong>For Vercel deployment:</strong> Add the environment
                  variable in your project settings:
                </Body>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Icon icon="Settings" className="w-4 h-4" />
                  <span>
                    Project Settings &rarr; Environment Variables &rarr; Add{' '}
                    <code className="bg-gray-200 px-1.5 py-0.5 rounded">
                      ASSEMBLY_API_KEY
                    </code>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
                4
              </div>
              <div>
                <Heading size="base">Restart the dev server</Heading>
                <Body size="base" className="text-gray-500 mt-1">
                  After adding your API key, restart the development server:
                </Body>
                <pre className="bg-gray-900 text-gray-100 p-3 rounded-md text-sm mt-3">
                  yarn dev
                </pre>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex gap-3">
            <Icon icon="Book" className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <Body size="sm" className="text-blue-800">
              Need more help? Check out the{' '}
              <a
                href="https://docs.assembly.com/docs/custom-apps-overview"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-medium"
              >
                Custom Apps Guide
              </a>{' '}
              for detailed instructions.
            </Body>
          </div>
        </div>
      </div>
    </Container>
  );
}
