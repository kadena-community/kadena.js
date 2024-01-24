import type { ChainId, IKeyPair } from '@kadena/types';

export interface IAccountWithSecretKey extends IAccount {
  secretKey: string;
}

export interface IAccount {
  account: string;
  chainId: ChainId;
  keys: IKeyPair[];
}

export interface IGeneratedKeyPair {
  chainId: ChainId;
  keys: IKeyPair[];
}
