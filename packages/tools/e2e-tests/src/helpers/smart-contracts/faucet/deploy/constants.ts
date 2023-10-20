export interface IAdmin {
  name: string;
  publicKey: string;
}

export const ADMINS: IAdmin[] = [
  {
    name: 'Faucet Operation',
    publicKey:
      'dc28d70fceb519b61b4a797876a3dee07de78cebd6eddc171aef92f9a95d706e',
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
export const InitialFunding = { COIN_FAUCET: 10000, FAUCET_OPERATION: 20 };
