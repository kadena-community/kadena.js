import type { TNetworksCreateOptions } from '../networks/networksCreateQuestions.js';

export interface IDefaultNetworkOptions {
  [key: string]: TNetworksCreateOptions;
}

/**
 * @const networkDefaults
 * Provides the default network configurations for the mainnet, testnet, and custom created networks.
 */
export const networkDefaults: IDefaultNetworkOptions = {
  mainnet: {
    network: 'mainnet',
    networkId: 'mainnet01',
    networkHost: 'https://api.chainweb.com',
    networkExplorerUrl: 'https://explorer.chainweb.com/mainnet/tx/',
  },
  testnet: {
    network: 'testnet',
    networkId: 'testnet04',
    networkHost: 'https://api.testnet.chainweb.com',
    networkExplorerUrl: 'https://explorer.chainweb.com/testnet/tx/',
  },
  devnet: {
    network: 'devnet',
    networkId: 'fast-development',
    networkHost: 'http://localhost:8080/',
    networkExplorerUrl: 'http://localhost:8080/explorer',
  },
  other: {
    network: '',
    networkId: '',
    networkHost: '',
    networkExplorerUrl: '',
  },
};

export const defaultNetworksPath: string = `${process.cwd()}/.kadena/networks`;
export const standardNetworks: string[] = ['mainnet', 'testnet', 'devnet'];
export const defaultNetwork: string = 'devnet';
