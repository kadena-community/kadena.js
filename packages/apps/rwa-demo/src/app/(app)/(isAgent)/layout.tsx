'use client';
import { useAccount } from '@/hooks/account';
import type React from 'react';

const AgentLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { isAgent, account } = useAccount();
  if (!account && !isAgent) return null;
  return children;
};

export default AgentLayout;
