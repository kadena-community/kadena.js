import type { IAccount } from 'src/support/types/types';

export const sender00: IAccount = {
  account: 'sender00',
  chainId: '0',
  keys: [
    {
      publicKey:
        '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca',
      secretKey:
        '251a920c403ae8c8f65f59142316af3c82b631fba46ddea92ee8c95035bd2898',
    },
  ],
};

export const devnetMinerPublicKey =
  'f89ef46927f506c70b6a58fd322450a936311dc6ac91f4ec3d8ef949608dbf1f';
export const devnetMiner = `k:${devnetMinerPublicKey}`;
