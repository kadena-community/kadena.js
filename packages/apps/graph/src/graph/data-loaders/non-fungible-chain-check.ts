import { checkAccountChains } from '@services/token-service';
import DataLoader from 'dataloader';

// eslint-disable-next-line @typescript-eslint/naming-convention
interface NonFungibleChainCheck {
  accountName: string;
}

/**
 * Check the chains for which the account has non-fungible tokens
 *
 */
export const nonFungibleChainCheck = new DataLoader<
  NonFungibleChainCheck,
  string[]
>(async (keys: readonly NonFungibleChainCheck[]) => {
  const results = await Promise.all(
    keys.map(async (key) => {
      const result = await checkAccountChains(key.accountName);
      return result;
    }),
  );

  return results;
});
