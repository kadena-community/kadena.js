import type { IWalletAccount } from '@/components/AccountProvider/AccountType';
import { isKeysetGuard } from '@/components/AccountProvider/AccountType';

export const getPubkeyFromAccount = (account: IWalletAccount): string => {
  if (isKeysetGuard(account.guard)) {
    return account.guard.keys[0];
  }
  return '';
};
