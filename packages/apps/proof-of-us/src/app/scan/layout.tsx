'use client';
import { ProofOfUsProvider } from '@/components/ProofOfUsProvider/ProofOfUsProvider';
import { useAccount } from '@/hooks/account';
import { useSocket } from '@/hooks/socket';
import { useParams } from 'next/navigation';
import type { FC, PropsWithChildren } from 'react';
import { useEffect } from 'react';

const ScanLayout: FC<PropsWithChildren> = ({ children }) => {
  const { account, isMounted, login } = useAccount();
  const { connect, disconnect } = useSocket();
  const { id: proofOfUsId } = useParams();

  useEffect(() => {
    connect({ proofOfUsId: `${proofOfUsId}`, initiator: false });

    return () => {
      disconnect({ proofOfUsId: `${proofOfUsId}` });
    };
  }, [proofOfUsId]);

  if (!isMounted) return null;
  return (
    <ProofOfUsProvider>
      <section>
        scan. we need to check if the user is logged in. if not explain that
        they need to login. before continuing, scanning and signing
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
    </ProofOfUsProvider>
  );
};

export default ScanLayout;
