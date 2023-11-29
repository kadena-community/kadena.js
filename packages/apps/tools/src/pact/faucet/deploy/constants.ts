export interface IAdmin {
  name: string;
  publicKey: string;
}

export const ADMINS: IAdmin[] = [
  {
    name: 'Sander Looijenga',
    publicKey:
      '19b0bfa805be7ab93b4774a874a64f1cb715b8aa88e82c409cf64a0f41298385',
  },
  {
    name: 'Hee Kyun Yun',
    publicKey:
      'dfb16b13e4032a6878fd98506b22cb0d6e5932c541e656b7ee5d69d72e6eb76e',
  },
  {
    name: 'DevOps',
    publicKey:
      'ec3beb8e11c264e23365941ba6b561744e0d0d695eff962c173e89e8c5e00ae1',
  },
];

type Account = {
  publicKey: string;
  privateKey: string;
  accountName: string;
};

export const ADMIN: Account = {
  publicKey: '<PROVIDE_ONE_OF_THE_ADMINS>',
  privateKey: '<PROVIDE_ONE_OF_THE_ADMINS>',
  accountName: '<PROVIDE_ONE_OF_THE_ADMINS>',
};

export const NETWORK_ID: 'testnet04' | 'fast-development' = 'fast-development';

export const DOMAIN:
  | 'http://localhost:8080'
  | 'https://api.testnet.chainweb.com' = 'http://localhost:8080';

export const COIN_ACCOUNT: string = 'contract-admins';

export const GAS_STATION = 'c:Ecwy85aCW3eogZUnIQxknH8tG8uXHM5QiC__jeI0nWA';

export const GAS_PROVIDER: Account = {
  publicKey: '<INSERT_A_PUBLIC_KEY_HERE>',
  privateKey: '<INSERT_A_PRIVATE_KEY_HERE',
  accountName: '<INSERT_AN_ACCOUNT_NAME_HERE>',
};

export const DEVNET_GENESIS: Account = {
  publicKey: '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca',
  privateKey:
    '251a920c403ae8c8f65f59142316af3c82b631fba46ddea92ee8c95035bd2898',
  accountName: 'sender00',
};

export const InitialFunding = 10020; // 10000 + 20 gas station fees
