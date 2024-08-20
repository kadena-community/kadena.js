import { CHAINCOUNT } from '@/constants/constants';
import {
  devideChains,
  processChainAccounts,
} from '@/utils/processChainAccounts';
import { Stack } from '@kadena/kode-ui';
import type { FC, PropsWithChildren } from 'react';
import React, { useMemo } from 'react';
import type { IChainAccounts } from './components/ChainList';
import { ChainList } from './components/ChainList';

interface IProps extends PropsWithChildren {
  accountName: string;
  chains: IChainAccounts;
}
export const AccountBalanceDistribution: FC<IProps> = ({ chains = [] }) => {
  const { chains1, chains2 } = useMemo(() => {
    const enrichedChains = processChainAccounts(chains, CHAINCOUNT);
    return devideChains(enrichedChains);
  }, [chains]);

  return (
    <Stack width="100%" gap="sm" flexDirection={{ xs: 'column', md: 'row' }}>
      <ChainList chains={chains1} />
      <ChainList chains={chains2} />
    </Stack>
  );
};
