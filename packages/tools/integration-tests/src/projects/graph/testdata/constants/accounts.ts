import type { ChainId } from '@kadena/types';

export interface IAccount {
  account: string;
  publicKey: string;
  chainId: ChainId;
  guard: string;
  secretKey?: string;
}

// the pre-funded account that will be used to fund other accounts
export const sender00Account: IAccount = {
  account: 'sender00',
  publicKey: '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca',
  chainId: '0',
  guard: '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca',
  // this is here only for testing purposes. in a real world scenario, the secret key should never be exposed
  secretKey: '251a920c403ae8c8f65f59142316af3c82b631fba46ddea92ee8c95035bd2898',
};
