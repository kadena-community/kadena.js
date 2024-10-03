import { ChainId } from '@kadena/client';
import { Stack } from '@kadena/kode-ui';
import type { FC, PropsWithChildren } from 'react';
import { useMemo } from 'react';
import { ChainList } from './components/ChainList';
import { divideChains, processChainAccounts } from './processChainAccounts';

interface IProps extends PropsWithChildren {
  chains: {
    chainId: ChainId;
    balance: number;
  }[];
  overallBalance: number;
  fundAccount: (chainId: ChainId) => Promise<void>;
}
export const AccountBalanceDistribution: FC<IProps> = ({
  chains,
  overallBalance,
  fundAccount,
}) => {
  const chainLists = useMemo(() => {
    const enrichedChains = processChainAccounts(chains, 20, overallBalance);
    return divideChains(enrichedChains, 2);
  }, [chains]);

  return (
    <Stack width="100%" gap="sm" flexDirection={{ xs: 'column', md: 'row' }}>
      {chainLists.map((chainList, idx) => (
        <ChainList key={idx} chains={chainList} fundAccount={fundAccount} />
      ))}
    </Stack>
  );
};
