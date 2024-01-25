'use client';
import { useAccount } from '@/hooks/account';
import type { FC } from 'react';

export const AccountInfo: FC = () => {
  const { account, login, logout, isMounted } = useAccount();

  if (!isMounted) return null;
  return (
    <section>
      {account ? (
        <button onClick={logout}>logout: {account.name}</button>
      ) : (
        <button onClick={login}>login</button>
      )}
    </section>
  );
};
