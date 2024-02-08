'use client';
import { useAccount } from '@/hooks/account';
import { useRouter } from 'next/navigation';
import type { FC, PropsWithChildren } from 'react';
import { useEffect } from 'react';

const UserLayout: FC<PropsWithChildren> = ({ children }) => {
  const { account, isMounted, login } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (!account && isMounted) {
      login();
    }
  }, [account, isMounted, router, login]);

  if (!account) return null;

  return <section>{children}</section>;
};

export default UserLayout;
