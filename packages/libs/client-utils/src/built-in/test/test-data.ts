import type { ChainId } from '@kadena/types';

export interface IAccount {
  account: string;
  publicKey: string;
  chainId: ChainId;
  guard: string;
}

export interface IAccountWithSecretKey extends IAccount {
  secretKey: string;
}

// this is here only for testing purposes. in a real world scenario, the secret key should never be exposed
export const sourceAccount: IAccountWithSecretKey = {
  account: 'k:5a2afbc4564b76b2c27ce5a644cab643c43663835ea0be22433b209d3351f937',
  publicKey: '5a2afbc4564b76b2c27ce5a644cab643c43663835ea0be22433b209d3351f937',
  chainId: '0',
  guard: '5a2afbc4564b76b2c27ce5a644cab643c43663835ea0be22433b209d3351f937',
  // this is here only for testing purposes. in a real world scenario, the secret key should never be exposed
  secretKey: 'e97b30547784bf05eb71a765b1d45127ed89d9b3c0cf21b71a107efb170eed33',
};

export const input = {
  chainId: '0' as ChainId,
  networkId: 'development',
  signers: [sourceAccount.publicKey],
  meta: {
    gasLimit: 70000,
    chainId: '0' as ChainId,
    ttl: 8 * 60 * 60,
    senderAccount: sourceAccount.account,
  },
  keysets: [
    {
      name: 'test-keyset',
      pred: 'keys-all',
      keys: [sourceAccount.publicKey],
    },
  ],
  data: { key: 'test-key', value: 'test-value' },
};
export const contractCode = '(+ 1 1)';
