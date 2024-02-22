import { useAccount } from '@/hooks/account';
import { Stack } from '@kadena/react-ui';
import type { FC, PropsWithChildren } from 'react';
import { ProofOfUsProvider } from '../ProofOfUsProvider/ProofOfUsProvider';

const ScanLayout: FC<PropsWithChildren> = ({ children }) => {
  const { account, isMounted, login } = useAccount();

  if (!isMounted) return null;
  return (
    <ProofOfUsProvider>
      <Stack as="section" paddingInline="md">
        {!account && isMounted ? (
          <section>
            <p>
              scan. we need to check if the user is logged in. if not explain
              that they need to login. before continuing, scanning and signing
            </p>
            <p>
              You need to be logged in to scan and claim your Proof Of Us
              <button onClick={login}>login</button>
            </p>
          </section>
        ) : (
          <section>{children}</section>
        )}
      </Stack>
    </ProofOfUsProvider>
  );
};

export default ScanLayout;
