import { TOptions } from '../config/initCommand';
/**
 * @interface IDefaultOptions
 * Represents the default configuration options for the mainnet, testnet, and devnet.
 */
export interface IDefaultOptions {
  mainnet: TOptions;
  testnet: TOptions;
  devnet: TOptions;
}

/**
 * @const defaults
 * Provides the default configurations for the mainnet, testnet, and devnet.
 */
export const defaults: IDefaultOptions = {
  mainnet: {
    publicKey: '',
    privateKey: '',
    chainId: 1,
    network: 'mainnet',
    networkId: 'mainnet01',
    networkHost: 'https://api.chainweb.com',
    networkExplorerUrl: 'https://explorer.chainweb.com/mainnet/tx/',
    kadenaNamesApiEndpoint: 'https://www.kadenanames.com/api/v1',
  },
  testnet: {
    publicKey: '',
    privateKey: '',
    chainId: 1,
    network: 'testnet',
    networkId: 'testnet04',
    networkHost: 'https://api.testnet.chainweb.com',
    networkExplorerUrl: 'https://explorer.chainweb.com/testnet/tx/',
    kadenaNamesApiEndpoint: 'https://www.kadenanames.com/api/v1',
  },
  devnet: {
    publicKey: '',
    privateKey: '',
    chainId: 0,
    network: 'devnet',
    networkId: '',
    networkHost: '',
    networkExplorerUrl: '',
    kadenaNamesApiEndpoint: 'https://www.kadenanames.com/api/v1',
  },
};

export const rootPath: string = `${process.cwd()}/.kadena/config.yaml`;
