import { getFungibleAccountDetails } from '@services/chainweb-node/fungible-account-details';
import DataLoader from 'dataloader';

interface FungibleAccountDetailsKey {
  fungibleName: string;
  accountName: string;
  chainId: string;
}

export const fungibleAccountDetailsLoader = new DataLoader<
  FungibleAccountDetailsKey,
  any
>(async (keys: readonly FungibleAccountDetailsKey[]) => {
  const results = await Promise.all(
    keys.map(({ fungibleName, accountName, chainId }) =>
      getFungibleAccountDetails(fungibleName, accountName, chainId),
    ),
  );

  return results;
});
