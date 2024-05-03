import { getTokenDetails } from '@services/token-service';
import DataLoader from 'dataloader';
import type { INonFungibleTokenBalance } from '../types/graphql-types';

interface ITokenDetailsKey {
  accountName: string;
  chainId?: string;
}

export const tokenDetailsLoader = new DataLoader<
  ITokenDetailsKey,
  INonFungibleTokenBalance[]
>(async (keys: readonly ITokenDetailsKey[]) => {
  const results = await Promise.all(
    keys.map(({ accountName, chainId }) =>
      getTokenDetails(accountName, chainId),
    ),
  );

  return results;
});
