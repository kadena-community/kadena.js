import type { IWalletAccount } from '@/components/AccountProvider/utils';
import type { ConnectedAccount } from '@kadena/spirekey-sdk';

export const getPubKey = (account: ConnectedAccount) => {
  return account.keyset?.keys.find((key) => key.includes('WEBAUTHN-')) ?? '';
};

export const getPubkeyFromAccount = (account: IWalletAccount) => {
  return account.guard.keys[0];
};
