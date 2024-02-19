import { getTokenDetails } from '@services/token-service';
import DataLoader from 'dataloader';
import type { Token } from '../types/graphql-types';

interface TokenDetailsKey {
  accountName: string;
  chainId?: string;
}

export const tokenDetailsLoader = new DataLoader<TokenDetailsKey, Token[]>(
  async (keys: readonly TokenDetailsKey[]) => {
    const results = await Promise.all(
      keys.map(({ accountName, chainId }) =>
        getTokenDetails(accountName, chainId),
      ),
    );

    return results;
  },
);
