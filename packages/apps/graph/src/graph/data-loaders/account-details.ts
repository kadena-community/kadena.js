import { getAccountDetails } from '@services/node-service';
import DataLoader from 'dataloader';

interface AccountDetailsKey {
  moduleName: string;
  accountName: string;
  chainId: string;
}

export const accountDetailsLoader = new DataLoader<AccountDetailsKey, any>(
  async (keys: readonly AccountDetailsKey[]) => {
    const results = await Promise.all(
      keys.map(({ moduleName, accountName, chainId }) =>
        getAccountDetails(moduleName, accountName, chainId),
      ),
    );

    return results;
  },
);
