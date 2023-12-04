'use client';
import { useAccount } from '@/hooks/account';
import { main } from '@/services/test';
import type { FC } from 'react';

export const AccountInfo: FC = () => {
  const { account, login, logout } = useAccount();
  return (
    <section>
      {account ? (
        <>
          <button onClick={logout}>logout: {account.name}</button>

          <pre>{JSON.stringify(account, null, 2)}</pre>

          <div>
            test:{' '}
            <button onClick={() => main(account.caccount)}>get info</button>
          </div>
        </>
      ) : (
        <button onClick={login}>login</button>
      )}
    </section>
  );
};
