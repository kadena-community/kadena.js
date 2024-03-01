import { useAccount } from '@/hooks/account';
import type { FC, PropsWithChildren } from 'react';
import { useEffect } from 'react';

export const LoginBoundry: FC<PropsWithChildren> = ({ children }) => {
  const { account, isMounted, login } = useAccount();

  useEffect(() => {
    if (!account && isMounted) {
      login();
    }
  }, [account, isMounted]);
  return <>{children}</>;
};
