import type { IWalletAccount } from '@/components/AccountProvider/AccountType';
import type { ISigner } from '@kadena/client';

export const setSigner = (account: IWalletAccount): ISigner => {
  if (account.walletType === 'WebAuthn') {
    return { pubKey: account.publicKey, scheme: 'WebAuthn' };
  }

  return account.publicKey;
};
