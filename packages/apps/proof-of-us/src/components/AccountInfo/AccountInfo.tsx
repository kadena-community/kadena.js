'use client';
import { useAccount } from '@/hooks/account';
import { createToken } from '@/services/marmalade';
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
            <button onClick={() => main(account.caccount)}>get balance</button>
          </div>

          <div>
            test:{' '}
            <button onClick={() => createToken(account.caccount)}>
              create token
            </button>
          </div>
        </>
      ) : (
        <button onClick={login}>login</button>
      )}
    </section>
  );
};
