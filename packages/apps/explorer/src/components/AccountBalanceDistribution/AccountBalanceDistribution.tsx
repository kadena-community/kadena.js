import { CHAINCOUNT } from '@/constants/constants';
import {
  divideChains,
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
  const chainLists = useMemo(() => {
    const enrichedChains = processChainAccounts(chains, CHAINCOUNT);
    return divideChains(enrichedChains, 2);
  }, [chains]);

  return (
    <Stack width="100%" gap="sm" flexDirection={{ xs: 'column', md: 'row' }}>
      {chainLists.map((chainList, idx) => (
        <ChainList key={idx} chains={chainList} />
      ))}
    </Stack>
  );
};
