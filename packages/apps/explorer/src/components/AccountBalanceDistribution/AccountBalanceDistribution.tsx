import { CHAINCOUNT } from '@/constants/constants';
import { fillChains } from '@/utils/fillChains';
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
  const { chains1, chains2, maxValue } = useMemo(() => {
    return fillChains(chains, CHAINCOUNT);
  }, [chains]);

  return (
    <Stack width="100%" gap="sm" flexDirection={{ xs: 'column', md: 'row' }}>
      <ChainList maxValue={maxValue} chains={chains1} />
      <ChainList maxValue={maxValue} chains={chains2} />
    </Stack>
  );
};
