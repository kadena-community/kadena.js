import { accountDetailsLoader } from '../graph/data-loaders/account-details';
import { ChainModuleAccount } from '../graph/types/graphql-types';

export async function getChainModuleAccount({
  chainId,
  moduleName,
  accountName,
}: {
  chainId: string;
  moduleName: string;
  accountName: string;
}): Promise<ChainModuleAccount | null> {
  const accountDetails = await accountDetailsLoader.load({
    moduleName,
    accountName,
    chainId,
  });

  return accountDetails !== null
    ? {
        chainId,
        accountName,
        moduleName,
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
