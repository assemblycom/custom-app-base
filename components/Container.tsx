const GUTTERS_CLASSNAME = 'px-9 py-8';

/**
 * The container component is a wrapper for app content that aligns
 * with the platform header padding.
 */
export function Container({
  children,
  className = '',
  gutters = true,
}: {
  children: React.ReactNode;
  className?: string;
  gutters?: boolean;
}) {
  return (
    <main
      className={[
        'flex min-h-screen flex-col max-w-full',
        gutters ? GUTTERS_CLASSNAME : '',
        className,
      ].join(' ')}
    >
      {children}
    </main>
  );
}
