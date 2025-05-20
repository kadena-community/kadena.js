import type { IWalletAccount } from '@/providers/WalletProvider/WalletType';
import {
  isKeysetGuard,
  isKeysetRefGuard,
} from '@/providers/WalletProvider/WalletType';

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
