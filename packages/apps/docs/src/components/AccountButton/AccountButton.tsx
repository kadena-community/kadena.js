import { useAccount } from '@/hooks/useAccount';
import { IconButton } from '@kadena/react-ui';
import type { FC } from 'react';
import React from 'react';

export const AccountButton: FC = () => {
  const { login, logout, account } = useAccount();

  if (account) {
    return <IconButton icon="Account" onClick={logout} />;
  }

  return <IconButton icon="WIcon" onClick={login} />;
};
