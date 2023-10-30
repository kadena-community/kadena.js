import type { TDevnetsCreateOptions } from '../devnet/devnetsCreateQuestions.js';

export interface IDefaultDevnetOptions {
  [key: string]: TDevnetsCreateOptions;
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
  other: {
    name: '',
    port: 8080,
    useVolume: false,
    mountPactFolder: '',
    version: '',
  },
};

export const defaultDevnetsPath: string = `${process.cwd()}/.kadena/devnets`;
export const standardDevnets: string[] = ['devnet'];
export const defaultDevnet: string = 'devnet';
