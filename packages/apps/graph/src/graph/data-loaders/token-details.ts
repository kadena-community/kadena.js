import { getTokenDetails } from '@services/token-service';
import DataLoader from 'dataloader';

interface TokenDetailsKey {
  accountName: string;
  chainId?: string;
}

export const tokenDetailsLoader = new DataLoader<TokenDetailsKey, any>(
  async (keys: readonly TokenDetailsKey[]) => {
    const results = await Promise.all(
      keys.map(({ accountName, chainId }) =>
        getTokenDetails(accountName, chainId),
      ),
    );

    return results;
  },
);
