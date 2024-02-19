import { getAccountDetails } from '@services/chainweb-node/account-details';
import DataLoader from 'dataloader';

interface AccountDetailsKey {
  fungibleName: string;
  accountName: string;
  chainId: string;
}

export const accountDetailsLoader = new DataLoader<AccountDetailsKey, any>(
  async (keys: readonly AccountDetailsKey[]) => {
    const results = await Promise.all(
      keys.map(({ fungibleName: fungibleName, accountName, chainId }) =>
        getAccountDetails(fungibleName, accountName, chainId),
      ),
    );

    return results;
  },
);
