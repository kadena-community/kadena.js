const environment: 'DEV_NET' = 'DEV_NET';

export interface IAccount {
  publicKey: string;
  secretKey: string;
  accountName: string;
}

export const SENDER_00: IAccount = {
  publicKey: '368820f80c324bbc7c2b0610688a7da43e39f91d118732671cd9c7500ff43cca',
  secretKey: '251a920c403ae8c8f65f59142316af3c82b631fba46ddea92ee8c95035bd2898',
  accountName: 'sender00',
};

export interface IAdmin {
  name: string;
  publicKey: string;
}

export const ADMINS: IAdmin[] = [
  {
    name: SENDER_00.accountName,
    publicKey: SENDER_00.publicKey,
  },
];

export const ADMIN: IAccount = SENDER_00;

export const NAMESPACES = {
  DEV_NET: 'n_34d947e2627143159ea73cdf277138fd571f17ac',
  TEST_NET: 'n_d8cbb935f9cd9d2399a5886bb08caed71f9bad49',
} as const;

export const NAMESPACE = NAMESPACES[environment];

export const NETWORK_ID: 'development' = 'development';

export const DOMAIN: string = 'http://localhost:8080';

export const GAS_STATIONS = {
  DEV_NET: 'c:zWPXcVXoHwkNTzKhMU02u2tzN_yL6V3-XTEH1uJaVY4',
  TEST_NET: 'c:Ecwy85aCW3eogZUnIQxknH8tG8uXHM5QiC__jeI0nWA',
} as const;

export const GAS_STATION = GAS_STATIONS[environment];

export const DEFAULT_CONTRACT_NAME = 'coin-faucet';

export const InitialFunding = 10020; // 10000 + 20 gas station fees
