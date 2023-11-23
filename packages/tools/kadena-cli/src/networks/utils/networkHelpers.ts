import {
  defaultNetworksPath,
  networkDefaults,
  networkFiles,
} from '../../constants/networks.js';

import { PathExists, removeFile, writeFile } from '../../utils/filesystem.js';
import {
  // createSymbol,
  mergeConfigs,
  sanitizeFilename,
} from '../../utils/helpers.js';

import type { WriteFileOptions } from 'fs';
import { existsSync, mkdirSync, readFileSync, readdirSync } from 'fs';
import yaml from 'js-yaml';
import path from 'path';

export interface ICustomNetworkChoice {
  value: string; // | typeof skipSymbol | typeof createSymbol;
  name?: string;
  description?: string;
  disabled?: boolean | string;
}

export interface INetworkCreateOptions {
  network: string;
  networkId: string;
  networkHost: string;
  networkExplorerUrl: string;
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
 * @param {TNetworksCreateOptions} options - The set of configuration options.
 * @param {string} options.network - The network (e.g., 'mainnet', 'testnet') or custom network.
 * @param {string} options.networkId - The ID representing the network.
 * @param {string} options.networkHost - The hostname for the network.
 * @param {string} options.networkExplorerUrl - The URL for the network explorer.
 * @returns {void} - No return value; the function writes directly to a file.
 */
export function writeNetworks(options: INetworkCreateOptions): void {
  const { network } = options;
  const sanitizedNetwork = sanitizeFilename(network).toLowerCase();
  const networkFilePath = path.join(
    defaultNetworksPath,
    `${sanitizedNetwork}.yaml`,
  );

  let existingConfig: INetworkCreateOptions;

  if (PathExists(networkFilePath)) {
    existingConfig = yaml.load(
      readFileSync(networkFilePath, 'utf8'),
    ) as INetworkCreateOptions;
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
 * @param {Pick<INetworkCreateOptions, 'network'>} options - The set of configuration options.
 * @param {string} options.network - The network (e.g., 'mainnet', 'testnet') or custom network.
 */
export function removeNetwork(
  options: Pick<INetworkCreateOptions, 'network'>,
): void {
  const { network } = options;
  const sanitizedNetwork = sanitizeFilename(network).toLowerCase();
  const networkFilePath = path.join(
    defaultNetworksPath,
    `${sanitizedNetwork}.yaml`,
  );

  removeFile(networkFilePath);
}

export function checkHasNetworksConfiguration(): boolean {
  if (!existsSync(defaultNetworksPath)) {
    return false;
  }

  const files = readdirSync(defaultNetworksPath);
  return files.some((file) => path.extname(file).toLowerCase() === '.yaml');
}

export function loadNetworkConfig(
  network: string,
): INetworksCreateOptions | never {
  const networkFilePath = path.join(defaultNetworksPath, `${network}.yaml`);

  if (!existsSync(networkFilePath)) {
    throw new Error('Network configuration file not found.');
  }

  return yaml.load(
    readFileSync(networkFilePath, 'utf8'),
  ) as INetworksCreateOptions;
}

export async function ensureNetworksConfiguration(): Promise<void> {
  if (!existsSync(defaultNetworksPath)) {
    mkdirSync(defaultNetworksPath, { recursive: true });
  }

  for (const [network, filePath] of Object.entries(networkFiles)) {
    console.log(network, filePath);
    if (!existsSync(filePath)) {
      writeNetworks(networkDefaults[network]);
    }
  }
}
