import { useAccount } from '@/hooks/account';
import { Stack } from '@kadena/kode-ui';
import type { FC } from 'react';

export const AgentRootPage: FC = () => {
  const { isAgent } = useAccount();

  if (!isAgent) return null;

  return <Stack width="100%">sdf</Stack>;
};
