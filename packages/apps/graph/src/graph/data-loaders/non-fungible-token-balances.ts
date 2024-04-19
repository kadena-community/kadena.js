import { getNonFungibleTokenBalances } from '@services/token-service';
import DataLoader from 'dataloader';
import type { INonFungibleTokenBalance } from '../types/graphql-types';

interface INonFungibleTokenBalancesKey {
  accountName: string;
  chainId?: string;
}

export const nonFungibleTokenBalancesLoader = new DataLoader<
  INonFungibleTokenBalancesKey,
  INonFungibleTokenBalance[]
>(async (keys: readonly INonFungibleTokenBalancesKey[]) => {
  const results = await Promise.all(
    keys.map(({ accountName, chainId }) =>
      getNonFungibleTokenBalances(accountName, chainId),
    ),
  );

  return results;
});
