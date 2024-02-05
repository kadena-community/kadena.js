'use client';
import { useAccount } from '@/hooks/account';
import { useRouter } from 'next/navigation';
import type { FC } from 'react';
import { useEffect } from 'react';

const Page: FC = () => {
  const { account, isMounted, login } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (!isMounted || !account) return;
    router.push('/user');
  }, [isMounted]);

  return <div>{!account && <button onClick={login}>login</button>}</div>;
};

export default Page;
