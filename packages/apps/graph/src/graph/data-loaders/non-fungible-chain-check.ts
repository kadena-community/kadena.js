import { checkAccountChains } from '@services/token-service';
import DataLoader from 'dataloader';

interface INonFungibleChainCheck {
  accountName: string;
}

/**
 * Check the chains for which the account has non-fungible tokens
 */
export const nonFungibleChainCheck = new DataLoader<
  INonFungibleChainCheck,
  string[]
>(async (keys: readonly INonFungibleChainCheck[]) => {
  const results = await Promise.all(
    keys.map(async (key) => {
      const result = await checkAccountChains(key.accountName);
      return result;
    }),
  );

  return results;
});
