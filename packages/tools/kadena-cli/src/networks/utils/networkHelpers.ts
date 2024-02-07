import {
  defaultNetworksPath,
  networkDefaults,
  networkFiles,
} from '../../constants/networks.js';

import { mergeConfigs, sanitizeFilename } from '../../utils/helpers.js';

import { existsSync, mkdirSync, readFileSync, readdirSync } from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import { services } from '../../services/index.js';

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
export async function writeNetworks(
  options: INetworkCreateOptions,
): Promise<void> {
  const { network } = options;
  const sanitizedNetwork = sanitizeFilename(network).toLowerCase();
  const networkFilePath = path.join(
    defaultNetworksPath,
    `${sanitizedNetwork}.yaml`,
  );

  let existingConfig: INetworkCreateOptions =
    typeof networkDefaults[network] !== 'undefined'
      ? { ...networkDefaults[network] }
      : { ...networkDefaults.other };

  if (await services.filesystem.fileExists(networkFilePath)) {
    const content = await services.filesystem.readFile(networkFilePath);
    if (content !== null) {
      existingConfig = yaml.load(content!) as INetworkCreateOptions;
    }
  }

  const networkConfig = mergeConfigs(existingConfig, options);

  await services.filesystem.ensureDirectoryExists(networkFilePath);
  await services.filesystem.writeFile(
    networkFilePath,
    yaml.dump(networkConfig),
  );
}

/**
 * Removes the given network setting from the networks folder
 *
 * @param {Pick<INetworkCreateOptions, 'network'>} options - The set of configuration options.
 * @param {string} options.network - The network (e.g., 'mainnet', 'testnet') or custom network.
 */
export async function removeNetwork(
  options: Pick<INetworkCreateOptions, 'network'>,
): Promise<void> {
  const { network } = options;
  const sanitizedNetwork = sanitizeFilename(network).toLowerCase();
  const networkFilePath = path.join(
    defaultNetworksPath,
    `${sanitizedNetwork}.yaml`,
  );

  await services.filesystem.deleteFile(networkFilePath);
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

  if (readdirSync(defaultNetworksPath).length !== 0) return;

  for (const [network, filePath] of Object.entries(networkFiles)) {
    if (!existsSync(filePath)) {
      await writeNetworks(networkDefaults[network]);
    }
  }
}
