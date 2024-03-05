import type { ChainId, IKeyPair } from '@kadena/types';
import type { IDevnetsCreateOptions } from '../devnet/utils/devnetHelpers.js';

export interface IDefaultDevnetOptions {
  [key: string]: IDevnetsCreateOptions;
}

export interface IAccount {
  account: string;
  chainId?: ChainId;
  keys: IKeyPair[];
}

export interface IAccountWithTokens extends IAccount {
  tokens: { [key: string]: number };
}

/**
 * @const devnetDefaults
 * Provides the default devnet configurations.
 */
export const devnetDefaults: IDefaultDevnetOptions = {
  devnet: {
    name: 'devnet',
    port: 8080,
    useVolume: false,
    mountPactFolder: '',
    version: 'latest',
  },
};

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

export const defaultDevnetsPath: string = `${process.cwd()}/.kadena/devnets`;
export const standardDevnets: string[] = ['devnet'];
export const defaultDevnet: string = 'devnet';
export const defaultAccount = sender00;

/**
 * @const simulationDefaults
 * Provides the default simulation configurations.
 */
export const simulationDefaults = {
  NETWORK_ID: 'development',
  CHAIN_COUNT: 20,
};

export const FAUCET_MODULE_NAME =
  'n_34d947e2627143159ea73cdf277138fd571f17ac.coin-faucet';
