import type { IWalletAccount } from '@/components/AccountProvider/AccountType';
import { isKeysetGuard } from '@/components/AccountProvider/AccountType';
import type { ConnectedAccount } from '@kadena/spirekey-sdk';

export const getPubKey = (account: ConnectedAccount) => {
  return account.keyset?.keys.find((key) => key.includes('WEBAUTHN-')) ?? '';
};

export const getPubkeyFromAccount = (account: IWalletAccount): string => {
  if (isKeysetGuard(account.guard)) {
    return account.guard.keys[0];
  }
  return '';
};
