import { accountDetailsLoader } from '../graph/data-loaders/account-details';
import type { ChainFungibleAccount } from '../graph/types/graphql-types';
import { ChainFungibleAccountName } from '../graph/types/graphql-types';

export async function getChainFungibleAccount({
  chainId,
  fungibleName,
  accountName,
}: {
  chainId: string;
  fungibleName: string;
  accountName: string;
}): Promise<ChainFungibleAccount | null> {
  const accountDetails = await accountDetailsLoader.load({
    fungibleName,
    accountName,
    chainId,
  });

  return accountDetails !== null
    ? {
        __typename: ChainFungibleAccountName,
        chainId,
        accountName,
        fungibleName,
        guard: {
          keys: accountDetails.guard.keys,
          predicate: accountDetails.guard.pred,
        },
        balance: accountDetails.balance,
        transactions: [],
        transfers: [],
      }
    : null;
}
