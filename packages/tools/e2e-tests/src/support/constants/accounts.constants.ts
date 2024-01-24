import type { IAccount } from '../types/accountTypes';

export const sender00Account: IAccount = {
  account: 'sender00',
  keys: [
    {
      publicKey:
        '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca',
      secretKey:
        '251a920c403ae8c8f65f59142316af3c82b631fba46ddea92ee8c95035bd2898',
    },
  ],
  chainId: '0',
};

export const devnetMiner: IAccount = {
  account: 'k:f89ef46927f506c70b6a58fd322450a936311dc6ac91f4ec3d8ef949608dbf1f',
  keys: [
    {
      publicKey:
        'f89ef46927f506c70b6a58fd322450a936311dc6ac91f4ec3d8ef949608dbf1f',
      secretKey: 'dummyValue',
    },
  ],
  chainId: '0',
};
