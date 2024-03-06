import { join } from 'path';
import type { INetworkCreateOptions } from '../networks/utils/networkHelpers.js';
import { NETWORKS_DIR } from './config.js';

export interface IDefaultNetworkOptions {
  [key: string]: INetworkCreateOptions;
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
    networkId: 'development',
    networkHost: 'http://localhost:8080',
    networkExplorerUrl: 'http://localhost:8080/explorer',
  },
  other: {
    network: '',
    networkId: '',
    networkHost: '',
    networkExplorerUrl: '',
  },
};

export const defaultNetworksPath: string = NETWORKS_DIR;
export const standardNetworks: string[] = ['mainnet', 'testnet'];
export const defaultNetwork: string = 'testnet';

type NetworkKey = Exclude<keyof typeof networkDefaults, 'other'>;

type INetworkFiles = Record<NetworkKey, string>;

export const networkFiles: INetworkFiles = Object.keys(networkDefaults).reduce(
  (files, key) => {
    if (key !== 'other') {
      files[key as NetworkKey] = join(defaultNetworksPath, `${key}.yaml`);
    }
    return files;
  },
  {} as INetworkFiles,
);
