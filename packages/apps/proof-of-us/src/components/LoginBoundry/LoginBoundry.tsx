import { useAccount } from '@/hooks/account';
import { useRouter } from 'next/navigation';
import type { FC, PropsWithChildren } from 'react';
import { useEffect } from 'react';

export const LoginBoundry: FC<PropsWithChildren> = ({ children }) => {
  const { account, isMounted } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (!account && isMounted) {
      router.replace('/');
    }
  }, [account, isMounted]);
  return <>{children}</>;
};
