'use client';
import { useAccount } from '@/hooks/account';
import { createToken } from '@/services/marmalade';
import { main } from '@/services/test';
import { env } from '@/utils/env';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';

export const AccountInfo: FC = () => {
  const { account, login, logout } = useAccount();
  const router = useRouter();

  const handleClick = async () => {
    if (!account) return;
    const order = await createToken(account.caccount);

    router.push(
      `${env.WALLET_URL}/sign?payload=${Buffer.from(
        JSON.stringify(order),
      ).toString('base64')}&cid=${account.cid}&returnUrl=http://localhost:3000`,
    );
  };
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
            test: <button onClick={handleClick}>create token</button>
          </div>
        </>
      ) : (
        <button onClick={login}>login</button>
      )}
    </section>
  );
};
