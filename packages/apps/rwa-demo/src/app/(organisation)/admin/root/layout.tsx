'use client';
import { useUser } from '@/hooks/user';
import { useRouter } from 'next/navigation';
import React from 'react';

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { userToken } = useUser();
  const router = useRouter();

  if (!userToken?.claims.rootAdmin) {
    router.replace('/');
    return null;
  }

  return <>{children}</>;
};

export default RootLayout;
