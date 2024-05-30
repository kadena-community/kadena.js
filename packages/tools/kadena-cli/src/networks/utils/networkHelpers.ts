import { getNetworkFiles, networkDefaults } from '../../constants/networks.js';

import {
  formatZodError,
  mergeConfigs,
  notEmpty,
  sanitizeFilename,
} from '../../utils/globalHelpers.js';
import { getDefaultNetworkName } from '../../utils/helpers.js';

import yaml from 'js-yaml';
import path from 'path';
import { z } from 'zod';
import { services } from '../../services/index.js';
import { KadenaError } from '../../services/service-error.js';
import {
  getNetworkDirectory,
  getNetworksSettingsFilePath,
} from './networkPath.js';

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

const networkSchema = z.object({
  network: z.string(),
  networkId: z.string(),
  networkHost: z.string().url(),
  networkExplorerUrl: z.string().optional(),
});

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
  kadenaDir: string,
  options: INetworkCreateOptions,
): Promise<void> {
  const { network } = options;
  const sanitizedNetwork = sanitizeFilename(network).toLowerCase();

  const networkFilePath = path.join(
    kadenaDir,
    'networks',
    `${sanitizedNetwork}.yaml`,
  );

  const validation = networkSchema.safeParse(options);

  if (!validation.success) {
    throw new Error(
      `Failed to write network config: ${formatZodError(validation.error)}`,
    );
  }

  await services.filesystem.ensureDirectoryExists(
    path.dirname(networkFilePath),
  );
  await services.filesystem.writeFile(networkFilePath, yaml.dump(options));
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
  const networkDir = getNetworkDirectory();
  if (networkDir === null) {
    throw new KadenaError('no_kadena_directory');
  }
  const { network } = options;
  const sanitizedNetwork = sanitizeFilename(network).toLowerCase();
  const networkFilePath = path.join(networkDir, `${sanitizedNetwork}.yaml`);

  await services.filesystem.deleteFile(networkFilePath);
}

export async function removeDefaultNetwork(): Promise<void> {
  const defaultNetworksSettingsFilePath = getNetworksSettingsFilePath();
  if (defaultNetworksSettingsFilePath === null) {
    throw new KadenaError('no_kadena_directory');
  }

  if (await services.filesystem.fileExists(defaultNetworksSettingsFilePath)) {
    await services.filesystem.deleteFile(defaultNetworksSettingsFilePath);
  }
}

export async function loadNetworkConfig(
  network: string,
): Promise<INetworksCreateOptions> {
  const networkDir = getNetworkDirectory();
  if (networkDir === null) {
    throw new KadenaError('no_kadena_directory');
  }
  const networkFilePath = path.join(networkDir, `${network}.yaml`);

  const file = await services.filesystem.readFile(networkFilePath);
  if (file === null) {
    throw new Error('Network configuration file not found.');
  }

  return yaml.load(file) as INetworksCreateOptions;
}

export async function getNetworks(): Promise<z.output<typeof networkSchema>[]> {
  const networkDir = getNetworkDirectory();
  if (networkDir === null) {
    throw new KadenaError('no_kadena_directory');
  }
  const files = await services.filesystem.readDir(networkDir);
  const networks = (
    await Promise.all(
      files.map(async (file) => {
        const networkFilePath = path.join(networkDir, file);
        const content = await services.filesystem.readFile(networkFilePath);
        if (content === null) return null;
        const parsed = networkSchema.safeParse(yaml.load(content));
        return parsed.success ? parsed.data : null;
      }),
    )
  ).filter(notEmpty);

  return networks;
}

export async function ensureNetworksConfiguration(
  kadenaDir: string,
): Promise<void> {
  await services.filesystem.ensureDirectoryExists(
    path.join(kadenaDir, 'networks'),
  );

  const networkFiles = getNetworkFiles(kadenaDir);
  for (const [network, filePath] of Object.entries(networkFiles)) {
    if (!(await services.filesystem.fileExists(filePath))) {
      await writeNetworks(kadenaDir, networkDefaults[network]);
    }
  }
}

interface INetworkChoiceOption {
  network?: string;
  name?: string;
}

export async function getNetworksInOrder<T extends INetworkChoiceOption>(
  networks: T[],
): Promise<T[]> {
  const defaultNetworkName = await getDefaultNetworkName();

  const partitionedNetworks = networks.reduce(
    (acc, obj) => {
      const networkKey = obj.network ?? obj.name;
      if (networkKey === defaultNetworkName) {
        acc.defaultNetworks.push(obj);
      } else {
        acc.remainingNetworks.push(obj);
      }
      return acc;
    },
    { defaultNetworks: [], remainingNetworks: [] } as {
      defaultNetworks: T[];
      remainingNetworks: T[];
    },
  );

  return [
    ...partitionedNetworks.defaultNetworks,
    ...partitionedNetworks.remainingNetworks,
  ];
}

export async function mergeNetworkConfig(
  kadenaDir: string,
  network: string,
  options: INetworkCreateOptions,
): Promise<INetworkCreateOptions> {
  const sanitizedNetwork = sanitizeFilename(network).toLowerCase();
  const networkFilePath = path.join(
    kadenaDir,
    'networks',
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

  return mergeConfigs(existingConfig, options);
}
