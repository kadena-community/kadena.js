import type { IWalletAccount } from '@/providers/AccountProvider/AccountType';

//firebase makes objects of arrays in the DB.
//to return the correct walletaccount we need to return those objects to arrays
export const objectsToArrayAccount = (account: any): IWalletAccount => {
  return {
    ...account,
    chains: Object.entries(account.chains ?? {}).map(([_POST, chain]) => chain),
    guard: {
      ...account.guard,
      keys: Object.entries(account.guard?.keys ?? {}).map(([_POST, v]) => v),
    },
    keyset: {
      ...account.keyset,
      keys: Object.entries(account.keyset?.keys ?? {}).map(([_, v]) => v),
    },
  } as IWalletAccount;
};
