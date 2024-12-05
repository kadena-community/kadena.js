import type { ConnectedAccount } from '@kadena/spirekey-sdk';

export const getPubKey = (account: ConnectedAccount) => {
  return account.keyset?.keys.find((key) => key.includes('WEBAUTHN-')) ?? '';
};
