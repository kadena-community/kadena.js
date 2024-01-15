import type { ChainId } from '@kadena/types';
import type { IDevnetsCreateOptions } from '../devnet/utils/devnetHelpers.js';

export interface IDefaultDevnetOptions {
  [key: string]: IDevnetsCreateOptions;
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

export const defaultDevnetsPath: string = `${process.cwd()}/.kadena/devnets`;
export const standardDevnets: string[] = ['devnet'];
export const defaultDevnet: string = 'devnet';

/**
 * @const simulationDefaults
 * Provides the default simulation configurations.
 */

export const simulationDefaults = {
  LOG_FOLDERNAME: `${process.cwd()}/simulation-logs}`,
  DEFAULT_CHAIN_ID: '0' as ChainId,
  NETWORK_HOST: 'http://localhost:8080',
  NETWORK_ID: 'fast-development',
  CHAIN_COUNT: 20,
};
