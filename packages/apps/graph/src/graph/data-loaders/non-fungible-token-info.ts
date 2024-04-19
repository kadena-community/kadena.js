import { getNonFungibleTokenInfo } from '@services/token-service';
import DataLoader from 'dataloader';
import type { INonFungibleTokenInfo } from '../types/graphql-types';

interface INonFungibleTokenInfoKey {
  tokenId: string;
  chainId: string;
  version: string;
}

/**
 * Get the info for a non-fungible token
 */
export const nonFungibleTokenInfoLoader = new DataLoader<
  INonFungibleTokenInfoKey,
  INonFungibleTokenInfo | null
>(async (keys: readonly INonFungibleTokenInfoKey[]) => {
  const results = await Promise.all(
    keys.map(({ tokenId, chainId, version }) =>
      getNonFungibleTokenInfo(tokenId, chainId, version),
    ),
  );

  return results;
});
