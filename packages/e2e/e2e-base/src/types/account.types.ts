import type { ChainId, IKeyPair } from '@kadena/types';

export interface IAccount {
  account: string;
  chains: ChainId[];
  keys: IKeyPair[];
}
