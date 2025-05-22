'use client';
import { AssetInfo } from '@/components/AssetInfo/AssetInfo';
import { useAccount } from '@/hooks/account';
import type React from 'react';

const AgentLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { isAgent, account } = useAccount();
  if (!account && !isAgent) return null;
  return (
    <>
      <AssetInfo />
      {children}
    </>
  );
};

export default AgentLayout;
