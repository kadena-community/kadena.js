import { ChainId } from '@kadena/types';

export interface IAccount {
  account: string;
  publicKey: string;
  chainId: ChainId;
  guard: string;
}
