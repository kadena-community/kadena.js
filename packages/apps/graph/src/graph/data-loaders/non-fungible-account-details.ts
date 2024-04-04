import { getNonFungibleAccountDetails } from '@services/chainweb-node/non-fungible-account-details';
import DataLoader from 'dataloader';

interface NonFungibleAccountDetailsKey {
  tokenId: string;
  accountName: string;
  chainId: string;
}

export const nonFungibleAccountDetailsLoader = new DataLoader<
  NonFungibleAccountDetailsKey,
  any
>(async (keys: readonly NonFungibleAccountDetailsKey[]) => {
  const results = await Promise.all(
    keys.map(({ tokenId, accountName, chainId }) =>
      getNonFungibleAccountDetails(tokenId, accountName, chainId),
    ),
  );

  return results;
});
