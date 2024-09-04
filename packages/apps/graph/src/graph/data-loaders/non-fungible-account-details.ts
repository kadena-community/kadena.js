import type { INonFungibleChainAccountDetails } from '@services/chainweb-node/non-fungible-account-details';
import { getNonFungibleAccountDetailsWithRetry } from '@services/chainweb-node/non-fungible-account-details';
import DataLoader from 'dataloader';

interface INonFungibleAccountDetailsKey {
  tokenId: string;
  accountName: string;
  chainId: string;
  version: string;
}

export const nonFungibleAccountDetailsLoader = new DataLoader<
  INonFungibleAccountDetailsKey,
  INonFungibleChainAccountDetails | null
>(async (keys: readonly INonFungibleAccountDetailsKey[]) => {
  const results = await Promise.all(
    keys.map(({ tokenId, accountName, chainId, version }) =>
      getNonFungibleAccountDetailsWithRetry(
        tokenId,
        accountName,
        chainId,
        version,
      ),
    ),
  );

  return results;
});
