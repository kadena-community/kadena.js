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
