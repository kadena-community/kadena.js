import { ChainId } from '@kadena/types';

export interface IAccount {
  account: string;
  publicKey: string;
  chainId: ChainId;
  guard: string;
}

// this is here only for testing purposes. in a real world scenario, the secret key should never be exposed
export interface IAccountWithSecretKey extends IAccount {
  secretKey: string;
}
