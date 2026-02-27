'use client';

import Linkify from 'react-linkify';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex flex-col min-h-screen items-center justify-center p-24">
      <div className="flex flex-col max-w-84 p-8 border-red-600 border">
        <p className="mb-2 [&>a:hover]:underline [&>a]:block">
          <Linkify
            componentDecorator={(decoratedHref, decoratedText, key) => (
              <a target="blank" href={decoratedHref} key={key}>
                {decoratedText}
              </a>
            )}
          >
            {error.message}
          </Linkify>
        </p>

        <button
          className="border border-stone-300 rounded py-[4.5px] px-[13px] self-start shadow"
          onClick={() => reset()}
        >
          Try again
        </button>
      </div>
    </main>
  );
}
