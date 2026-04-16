'use client';

import { useEffect } from 'react';
export function Header() {
  useEffect(() => {
    console.log(`
─╔═══╗─╔═══╗─╔═══╗─╔═══╗─╔═╗╔═╗─╔══╗──╔╗────╔╗──╔╗
─║╔═╗║─║╔═╗║─║╔═╗║─║╔══╝─║║╚╝║║─║╔╗║──║║────║╚╗╔╝║
─║║─║║─║╚══╗─║╚══╗─║╚══╗─║╔╗╔╗║─║╚╝╚╗─║║────╚╗╚╝╔╝
─║╚═╝║─╚══╗║─╚══╗║─║╔══╝─║║║║║║─║╔═╗║─║║─╔╗──╚╗╔╝─
─║╔═╗║─║╚═╝║─║╚═╝║─║╚══╗─║║║║║║─║╚═╝║─║╚═╝║───║║──
─╚╝─╚╝─╚═══╝─╚═══╝─╚═══╝─╚╝╚╝╚╝─╚═══╝─╚═══╝───╚╝──

📚 Documentation: https://docs.assembly.com
`);
  }, []);

  return (
    <header className="mb-12">
      <p className="text-lg text-gray-500 max-w-prose">
        This template demonstrates the capabilities available when building
        custom apps for Assembly. Explore the sections below to see what you
        can build.
      </p>
    </header>
  );
}
