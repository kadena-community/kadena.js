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

export const ADMIN: {
  publicKey: string;
  privateKey: string;
  accountName: string;
} = {
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

export const GAS_PROVIDER: {
  publicKey: string;
  privateKey: string;
  accountName: string;
} = {
  publicKey: '<INSERT_A_PUBLIC_KEY_HERE>',
  privateKey: '<INSERT_A_PRIVATE_KEY_HERE',
  accountName: '<INSERT_AN_ACCOUNT_NAME_HERE>',
};

export const InitialFunding = 10020; // 10000 + 20 gas station fees
