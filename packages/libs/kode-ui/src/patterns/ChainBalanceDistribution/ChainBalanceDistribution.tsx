import type { FC } from 'react';
import React, { useMemo } from 'react';
import { Stack } from './../../components';
import { ChainList } from './components/ChainList';
import type { IChainBalanceDistributionProps } from './types';
import { divideChains } from './utils/processChainAccounts';

export const ChainBalanceDistribution: FC<IChainBalanceDistributionProps> = ({
  chains = [],
}) => {
  const chainLists = useMemo(() => {
    return divideChains(chains, 2);
  }, [chains]);

  return (
    <Stack width="100%" gap="sm" flexDirection={{ xs: 'column', md: 'row' }}>
      {chainLists.map((chainList, idx) => (
        <ChainList key={idx} chains={chainList} />
      ))}
    </Stack>
  );
};
