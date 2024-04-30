import type { IFungibleChainAccountDetails } from '@services/chainweb-node/fungible-account-details';
import { getFungibleAccountDetails } from '@services/chainweb-node/fungible-account-details';
import DataLoader from 'dataloader';

interface IFungibleAccountDetailsKey {
  fungibleName: string;
  accountName: string;
  chainId: string;
}

export const fungibleAccountDetailsLoader = new DataLoader<
  IFungibleAccountDetailsKey,
  IFungibleChainAccountDetails | null
>(async (keys: readonly IFungibleAccountDetailsKey[]) => {
  const results = await Promise.all(
    keys.map(({ fungibleName, accountName, chainId }) =>
      getFungibleAccountDetails(fungibleName, accountName, chainId),
    ),
  );

  return results;
});
