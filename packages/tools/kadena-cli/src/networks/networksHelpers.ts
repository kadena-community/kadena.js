import { defaultNetworksPath, networkDefaults } from '../constants/networks.js';
import { PathExists, removeFile, writeFile } from '../utils/filesystem.js';
import { mergeConfigs, sanitizeFilename } from '../utils/helpers.js';

import type { WriteFileOptions } from 'fs';
import { existsSync, readFileSync } from 'fs';
import yaml from 'js-yaml';
import path from 'path';

export interface ICustomNetworksChoice {
  value: string;
  name?: string;
  description?: string;
  disabled?: boolean | string;
}

export interface INetworksCreateOptions {
  network: string;
  networkId: string;
  networkHost: string;
  networkExplorerUrl: string;
}

/**
 * Writes the given network setting to the networks folder
 *
 * @param {INetworksCreateOptions} options - The set of configuration options.
 * @param {string} options.network - The network (e.g., 'mainnet', 'testnet') or custom network.
 * @param {number} options.networkId - The ID representing the network.
 * @param {string} options.networkHost - The hostname for the network.
 * @param {string} options.networkExplorerUrl - The URL for the network explorer.
 * @returns {void} - No return value; the function writes directly to a file.
 */
export function writeNetworks(options: INetworksCreateOptions): void {
  const { network } = options;
  const sanitizedNetwork = sanitizeFilename(network).toLowerCase();
  const networkFilePath = path.join(
    defaultNetworksPath,
    `${sanitizedNetwork}.yaml`,
  );

  let existingConfig: INetworksCreateOptions;

  if (PathExists(networkFilePath)) {
    existingConfig = yaml.load(
      readFileSync(networkFilePath, 'utf8'),
    ) as INetworksCreateOptions;
  } else {
    // Explicitly check if network key exists in networkDefaults and is not undefined
    existingConfig =
      typeof networkDefaults[network] !== 'undefined'
        ? { ...networkDefaults[network] }
        : { ...networkDefaults.other };
  }

  const networkConfig = mergeConfigs(existingConfig, options);

  writeFile(
    networkFilePath,
    yaml.dump(networkConfig),
    'utf8' as WriteFileOptions,
  );
}

/**
 * Removes the given network setting from the networks folder
 *
 * @param {Pick<INetworksCreateOptions, 'network'>} options - The set of configuration options.
 * @param {string} options.network - The network (e.g., 'mainnet', 'testnet') or custom network.
 */
export function removeNetwork(
  options: Pick<INetworksCreateOptions, 'network'>,
): void {
  const { network } = options;
  const sanitizedNetwork = sanitizeFilename(network).toLowerCase();
  const networkFilePath = path.join(
    defaultNetworksPath,
    `${sanitizedNetwork}.yaml`,
  );

  removeFile(networkFilePath);
}

export function loadNetworkConfig(network: string): INetworksCreateOptions {
  const networkFilePath = path.join(defaultNetworksPath, `${network}.yaml`);

  if (!existsSync(networkFilePath)) {
    throw new Error('Network configuration file not found.');
  }

  return yaml.load(
    readFileSync(networkFilePath, 'utf8'),
  ) as INetworksCreateOptions;
}
