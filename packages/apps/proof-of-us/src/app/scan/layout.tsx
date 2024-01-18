'use client';
import { useAccount } from '@/hooks/account';
import type { FC, PropsWithChildren } from 'react';

const ScanLayout: FC<PropsWithChildren> = ({ children }) => {
  const { account, isMounted, login } = useAccount();

  if (!isMounted) return null;
  return (
    <section>
      scan. we need to check if the user is logged in. if not explain that they
      need to login. before continuing, scanning and signing
      {!account && isMounted ? (
        <section>
          <p>
            You need to be logged in to scan and claim your Proof Of Us
            <button onClick={login}>login</button>
          </p>
        </section>
      ) : (
        <section>{children}</section>
      )}
    </section>
  );
};

export default ScanLayout;
