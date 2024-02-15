import { checkAccountChains } from '@services/token-service';
import DataLoader from 'dataloader';

interface NonFungibleChainCheck {
  accountName: string;
}

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
