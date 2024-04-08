import { getTokenDetails } from '@services/token-service';
import DataLoader from 'dataloader';
import type { NonFungibleTokenBalance } from '../types/graphql-types';

// eslint-disable-next-line @typescript-eslint/naming-convention
interface TokenDetailsKey {
  accountName: string;
  chainId?: string;
}

export const tokenDetailsLoader = new DataLoader<
  TokenDetailsKey,
  NonFungibleTokenBalance[]
>(async (keys: readonly TokenDetailsKey[]) => {
  const results = await Promise.all(
    keys.map(({ accountName, chainId }) =>
      getTokenDetails(accountName, chainId),
    ),
  );

  return results;
});
