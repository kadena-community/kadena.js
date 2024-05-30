import { join } from 'path';
import type { INetworkCreateOptions } from '../commands/networks/utils/networkHelpers.js';

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
    networkExplorerUrl: 'http://localhost:8080/explorer/development/tx/',
  },
  other: {
    network: '',
    networkId: '',
    networkHost: '',
    networkExplorerUrl: '',
  },
};

export const standardNetworks: string[] = ['mainnet', 'testnet'];
export const defaultNetwork: string = 'testnet';

type NetworkKey = Exclude<keyof typeof networkDefaults, 'other'>;

type INetworkFiles = Record<NetworkKey, string>;

export const getNetworkFiles = (kadenaDir: string): INetworkFiles => {
  const networkPath = join(kadenaDir, 'networks');
  return Object.keys(networkDefaults).reduce((files, key) => {
    if (key !== 'other') {
      files[key as NetworkKey] = join(networkPath, `${key}.yaml`);
    }
    return files;
  }, {} as INetworkFiles);
};

export const NETWORK_CONFIG_NOT_FOUND_MESSAGE =
  'No network configuration found for a network name';

export const NO_NETWORKS_FOUND_ERROR_MESSAGE =
  'No networks found. To add one, use: `kadena network add`. To add default networks, use: `kadena config init`.';
