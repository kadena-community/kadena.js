'use client';
import { useAccount } from '@/hooks/account.hook';
import type { FC } from 'react';

export const AccountInfo: FC = () => {
  const { account, login, logout } = useAccount();
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
