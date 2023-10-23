export interface IAdmin {
  name: string;
  publicKey: string;
}

export const ADMINS: IAdmin[] = [
  {
    name: 'Faucet Operation',
    publicKey:
      '019e6a6d8e0dee90ee600a22df82eccdd9ecfbb2400f64e6eb64d5eee8e876da',
    // privateKey: 'a3487e979f54cabfe43097f39bd6f9fc297c5dc76b66b12f905acfb375ba6a00'
  },
  {
    name: 'sender00',
    publicKey:
      '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca',
  },
];

export const NETWORK_ID = 'fast-development';

export const DOMAIN = 'http://127.0.0.1:8080';

export const COIN_ACCOUNT: string = 'contract-admins';

export const GAS_PROVIDER: {
  publicKey: string;
  privateKey: string;
  accountName: string;
} = {
  publicKey: '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca',
  privateKey:
    '251a920c403ae8c8f65f59142316af3c82b631fba46ddea92ee8c95035bd2898',
  accountName: 'sender00',
};

// eslint-disable-next-line @kadena-dev/typedef-var
export const InitialFunding = { COIN_FAUCET: 10000, FAUCET_OPERATION: 5000 };
