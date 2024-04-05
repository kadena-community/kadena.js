import { getAccountDetails } from '@services/chainweb-node/account-details';
import DataLoader from 'dataloader';

// eslint-disable-next-line @typescript-eslint/naming-convention
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
