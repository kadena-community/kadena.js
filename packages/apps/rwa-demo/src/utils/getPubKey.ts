import type { IWalletAccount } from '@/providers/AccountProvider/AccountType';
import {
  isKeysetGuard,
  isKeysetRefGuard,
} from '@/providers/AccountProvider/AccountType';

export const getPubkeyFromAccount = (account: IWalletAccount): string => {
  return account.publicKey;
};

export const getGuard = (account: IWalletAccount): any => {
  if (isKeysetGuard(account.guard) || isKeysetRefGuard(account.guard)) {
    return account.guard;
  }

  return;
};
export const getKeyset = (account: IWalletAccount): any => {
  return account.keyset;
};
