'use client';

import { useApp } from '@/hooks/getApp';
import { Heading } from '@kadena/kode-ui';
import { use } from 'react';
const AppLayout = ({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ appId: string }>;
}>) => {
  const { appId } = use(params);
  const { data, isLoading } = useApp(appId);

  if (isLoading) {
    return 'loading...';
  }

  return (
    <>
      <Heading>{data?.name}</Heading>
      {children}
    </>
  );
};

export default AppLayout;
