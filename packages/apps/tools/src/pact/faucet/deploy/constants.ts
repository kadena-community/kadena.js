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
    name: 'Faucet Operation',
    publicKey:
      'dc28d70fceb519b61b4a797876a3dee07de78cebd6eddc171aef92f9a95d706e',
  },
];

export const NETWORK_ID: 'testnet04' | 'fast-development' = 'testnet04';

export const DOMAIN:
  | 'http://localhost:8080'
  | 'https://api.testnet.chainweb.com' = 'https://api.testnet.chainweb.com';

export const COIN_ACCOUNT: string = 'contract-admins';

export const GAS_PROVIDER: {
  publicKey: string;
  privateKey: string;
  accountName: string;
} = {
  publicKey: '<INSERT_A_PUBLIC_KEY_HERE>',
  privateKey: '<INSERT_A_PRIVATE_KEY_HERE',
  accountName: '<INSERT_AN_ACCOUNT_NAME_HERE>',
};

// eslint-disable-next-line @kadena-dev/typedef-var
export const InitialFunding = { COIN_FAUCET: 10000, FAUCET_OPERATION: 20 };
