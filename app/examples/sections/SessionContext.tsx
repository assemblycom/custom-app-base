'use client';

import type { SessionData } from '@/utils/session';

function UserTypeBadge({ isInternal }: { isInternal: boolean }) {
  return (
    <span
      className={[
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
        isInternal
          ? 'bg-purple-100 text-purple-800'
          : 'bg-blue-100 text-blue-800',
      ].join(' ')}
    >
      {isInternal ? 'Internal User' : 'Client'}
    </span>
  );
}

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <p className="text-sm text-gray-500 mb-2">
        {title}
      </p>
      {children}
    </div>
  );
}

function Avatar({
  src,
  name,
  size = 'md',
}: {
  src?: string;
  name: string;
  size?: 'sm' | 'md';
}) {
  const sizeClasses = size === 'sm' ? 'w-8 h-8 text-sm' : 'w-12 h-12 text-lg';

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClasses} rounded-full object-cover`}
      />
    );
  }

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`${sizeClasses} rounded-full bg-gray-300 flex items-center justify-center font-medium text-gray-600`}
    >
      {initials}
    </div>
  );
}

export function SessionContext({ session }: { session: SessionData }) {
  const isInternal = !!session.internalUser;
  const user = isInternal ? session.internalUser : session.client;
  const userName = user
    ? [user.givenName, user.familyName].filter(Boolean).join(' ')
    : 'Unknown User';

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-xl font-semibold tracking-tight">Your Session Context</h2>
        <p className="text-base text-gray-500 mt-1">
          Data available from your session token
        </p>
      </div>

      <div className="mb-4">
        <UserTypeBadge isInternal={isInternal} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {user && (
          <InfoCard title="User">
            <div className="flex items-center gap-3">
              <Avatar src={user.avatarImageUrl} name={userName} />
              <div className="min-w-0 flex-1">
                <p className="text-base font-medium truncate">
                  {userName}
                </p>
                {user.email && (
                  <p className="text-sm text-gray-500 truncate">
                    {user.email}
                  </p>
                )}
                {isInternal && session.internalUser?.role && (
                  <p className="text-sm text-gray-500">
                    {session.internalUser.role}
                  </p>
                )}
              </div>
            </div>
          </InfoCard>
        )}

        {session.workspace && (
          <InfoCard title="Workspace">
            <div className="flex items-center gap-3">
              {session.workspace.squareIconUrl && (
                <img
                  src={session.workspace.squareIconUrl}
                  alt={session.workspace.brandName || 'Workspace'}
                  className="w-10 h-10 rounded object-contain"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-base font-medium truncate">
                  {session.workspace.brandName || 'Unnamed Workspace'}
                </p>
                {session.workspace.portalUrl && (
                  <p className="text-sm text-gray-500 truncate">
                    {session.workspace.portalUrl}
                  </p>
                )}
              </div>
            </div>
          </InfoCard>
        )}

        {session.company && (
          <InfoCard title="Company">
            <div className="flex items-center gap-3">
              {session.company.iconImageUrl ? (
                <img
                  src={session.company.iconImageUrl}
                  alt={session.company.name || 'Company'}
                  className="w-10 h-10 rounded object-contain"
                />
              ) : (
                <Avatar src={undefined} name={session.company.name || 'C'} />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-base font-medium truncate">
                  {session.company.name || 'Unnamed Company'}
                </p>
              </div>
            </div>
          </InfoCard>
        )}
      </div>
    </section>
  );
}
