export type Environment = 'DEVNET' | 'TESTNET';

const environment: Environment = 'DEVNET' as Environment;

export interface _IAccount {
  publicKey: string;
  privateKey: string;
  accountName: string;
}

export const DEVNET_GENESIS: _IAccount = {
  publicKey: '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca',
  privateKey:
    '251a920c403ae8c8f65f59142316af3c82b631fba46ddea92ee8c95035bd2898',
  accountName: 'sender00',
};

export interface IAdmin {
  name: string;
  publicKey: string;
}

export const ADMINS: IAdmin[] =
  environment === 'TESTNET'
    ? [
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
      ]
    : [
        {
          name: DEVNET_GENESIS.accountName,
          publicKey: DEVNET_GENESIS.publicKey,
        },
      ];

// Needs to be the credentials of one of the `ADMINS` specified above
export const ADMIN: _IAccount =
  environment === 'DEVNET'
    ? DEVNET_GENESIS
    : {
        publicKey: '<PROVIDE_ONE_OF_THE_ADMINS>',
        privateKey: '<PROVIDE_ONE_OF_THE_ADMINS>',
        accountName: '<PROVIDE_ONE_OF_THE_ADMINS>',
      };

export const NAMESPACES = {
  DEVNET: 'n_34d947e2627143159ea73cdf277138fd571f17ac',
  TESTNET: 'n_d8cbb935f9cd9d2399a5886bb08caed71f9bad49',
} as const;

export const NAMESPACE = NAMESPACES[environment];

export const NETWORK_ID: 'testnet04' | 'fast-development' = 'fast-development';

export const DOMAIN:
  | 'http://localhost:8080'
  | 'https://api.testnet.chainweb.com' = 'http://localhost:8080';

export const COIN_ACCOUNT: string = 'contract-admins';

export const GAS_STATIONS = {
  DEVNET: 'c:zWPXcVXoHwkNTzKhMU02u2tzN_yL6V3-XTEH1uJaVY4',
  TESTNET: 'c:Ecwy85aCW3eogZUnIQxknH8tG8uXHM5QiC__jeI0nWA',
} as const;

export const GAS_STATION = GAS_STATIONS[environment];

export const GAS_PROVIDER: _IAccount = {
  publicKey: '<INSERT_A_PUBLIC_KEY_HERE>',
  privateKey: '<INSERT_A_PRIVATE_KEY_HERE',
  accountName: '<INSERT_AN_ACCOUNT_NAME_HERE>',
};

export const InitialFunding = 10020; // 10000 + 20 gas station fees
