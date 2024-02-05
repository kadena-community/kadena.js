'use client';
import { useAccount } from '@/hooks/account';
import type { FC } from 'react';

export const AccountInfo: FC = () => {
  const { account, logout, isMounted } = useAccount();


  if (!isMounted || !account) return null;
  return (
    <section>
      <button onClick={logout}>logout: {account.displayName}</button>
    </section>
  );
};
