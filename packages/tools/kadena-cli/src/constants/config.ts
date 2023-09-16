import type { TConfigOptions } from '../config/configOptions';

export type Context = 'mainnet' | 'testnet' | 'devnet';

export interface IContext {
  currentContext: Context;
}

export type IDefaultConfigOptions = Omit<TConfigOptions, 'context'>;

/**
 * @interface IDefaultOptions
 * Represents the default configuration options for the mainnet, testnet, and devnet.
 */
export interface IDefaultOptions {
  contexts: {
    [key in Context]: IDefaultConfigOptions;
  };
}

/**
 * @const defaults
 * Provides the default configurations for the mainnet, testnet, and devnet.
 */
export const defaults: IDefaultOptions = {
  contexts: {
    mainnet: {
      publicKey: '',
      privateKey: '',
      chainId: 1,
      networkId: 'mainnet01',
      networkHost: 'https://api.chainweb.com',
      networkExplorerUrl: 'https://explorer.chainweb.com/mainnet/tx/',
      kadenaNamesApiEndpoint: 'https://www.kadenanames.com/api/v1',
    },
    testnet: {
      publicKey: '',
      privateKey: '',
      chainId: 1,
      networkId: 'testnet04',
      networkHost: 'https://api.testnet.chainweb.com',
      networkExplorerUrl: 'https://explorer.chainweb.com/testnet/tx/',
      kadenaNamesApiEndpoint: 'https://www.kadenanames.com/api/v1',
    },
    devnet: {
      publicKey: '',
      privateKey: '',
      chainId: 0,
      networkId: '',
      networkHost: '',
      networkExplorerUrl: '',
      kadenaNamesApiEndpoint: 'https://www.kadenanames.com/api/v1',
    },
  },
};

export const rootPath: string = `${process.cwd()}/.kadena`;

export const defaultContext: Context = 'testnet';
