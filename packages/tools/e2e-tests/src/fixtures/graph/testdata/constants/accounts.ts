import type { ChainId } from '@kadena/types';

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
// the pre-funded account that will be used to fund other accounts
export const sender00: IAccountWithSecretKey = {
  account: 'sender00',
  publicKey: '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca',
  guard: '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca',
  chainId: '0',
  // this is here only for testing purposes. in a real world scenario, the secret key should never be exposed
  secretKey: '251a920c403ae8c8f65f59142316af3c82b631fba46ddea92ee8c95035bd2898',
};

export const devnetMiner: IAccount = {
  account: 'k:f89ef46927f506c70b6a58fd322450a936311dc6ac91f4ec3d8ef949608dbf1f',
  publicKey: 'f89ef46927f506c70b6a58fd322450a936311dc6ac91f4ec3d8ef949608dbf1f',
  chainId: '0',
  guard: 'f89ef46927f506c70b6a58fd322450a936311dc6ac91f4ec3d8ef949608dbf1f',
};
