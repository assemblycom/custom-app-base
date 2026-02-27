'use client';

import { createContext, useContext } from 'react';

const TokenContext = createContext<string | null>(null);

export function TokenProvider({
  token,
  children,
}: {
  token: string;
  children: React.ReactNode;
}) {
  return (
    <TokenContext.Provider value={token}>{children}</TokenContext.Provider>
  );
}

export function useToken() {
  const token = useContext(TokenContext);
  if (!token) {
    throw new Error('useToken must be used within a TokenProvider');
  }
  return token;
}
