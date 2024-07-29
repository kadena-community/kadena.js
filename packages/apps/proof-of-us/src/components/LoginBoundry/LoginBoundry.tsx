import { useAccount } from '@/hooks/account';
import { Stack } from '@kadena/kode-ui';
import type { FC, PropsWithChildren } from 'react';
import { Button } from '../Button/Button';

export const LoginBoundry: FC<PropsWithChildren> = ({ children }) => {
  const { account, isMounted, login } = useAccount();

  const handleLogin = () => {
    login();
  };

  if (!isMounted) return;

  if (isMounted && !account) {
    return (
      <Stack
        width="100%"
        height="100%"
        justifyContent="center"
        alignItems="center"
        paddingInline="xxxl"
      >
        <Button onPress={handleLogin}>Login</Button>
      </Stack>
    );
  }

  return <>{children}</>;
};
