import { ChainId, IKeyPair } from '@kadena/types';

export interface IAccount {
  account: string;
  chainId?: ChainId;
  keys: IKeyPair[];
}

export interface IAccountWithTokens extends IAccount {
  tokens: { [key: string]: number };
}

export const sender00: IAccount = {
  keys: [
    {
      publicKey:
        '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca',
      secretKey:
        '251a920c403ae8c8f65f59142316af3c82b631fba46ddea92ee8c95035bd2898',
    },
  ],
  account: 'sender00',
};
