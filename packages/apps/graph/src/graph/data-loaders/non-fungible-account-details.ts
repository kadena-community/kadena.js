import type { INonFungibleChainAccountDetails } from '@services/chainweb-node/non-fungible-account-details';
import { getNonFungibleAccountDetails } from '@services/chainweb-node/non-fungible-account-details';
import DataLoader from 'dataloader';

interface INonFungibleAccountDetailsKey {
  tokenId: string;
  accountName: string;
  chainId: string;
}

export const nonFungibleAccountDetailsLoader = new DataLoader<
  INonFungibleAccountDetailsKey,
  INonFungibleChainAccountDetails | null
>(async (keys: readonly INonFungibleAccountDetailsKey[]) => {
  const results = await Promise.all(
    keys.map(({ tokenId, accountName, chainId }) =>
      getNonFungibleAccountDetails(tokenId, accountName, chainId),
    ),
  );

  return results;
});
