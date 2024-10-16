import { Stack } from '@kadena/kode-ui';
import type { FC } from 'react';
import React, { useMemo } from 'react';
import { ChainList } from './components/ChainList';
import type { IChainBalanceDistributionProps } from './types';
import {
  divideChains,
  processChainAccounts,
} from './utils/processChainAccounts';

export const AccountBalanceDistribution: FC<IChainBalanceDistributionProps> = ({
  chains = [],
  maxChainCount = 20,
}) => {
  const chainLists = useMemo(() => {
    const enrichedChains = processChainAccounts(chains, maxChainCount);
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
