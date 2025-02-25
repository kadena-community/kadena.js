import type {
  Guard,
  IWalletAccount,
} from '@/components/AccountProvider/AccountType';
import {
  isKeysetGuard,
  isKeysetRefGuard,
} from '@/components/AccountProvider/AccountType';

export const getPubkeyFromAccount = (account: IWalletAccount): Guard => {
  if (isKeysetGuard(account.guard)) {
    return account.guard.keys[0];
  }
  if (isKeysetRefGuard(account.guard)) {
    return account.guard;
  }
  return '';
};
