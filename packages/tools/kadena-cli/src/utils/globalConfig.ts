import { TOptions } from '../config/initCommand';
import { defaults, IDefaultOptions, rootPath } from '../constants/config';
import { writeFile } from '../utils/filesystem';
import { mergeConfigs } from '../utils/helpers';

import { BaseEncodingOptions, readFileSync } from 'fs';
import yaml from 'js-yaml';

/**
 * Loads and returns the current configuration from the default root path.
 *
 * @returns {TOptions} - The parsed configuration object.
 */
export function getConfig(): TOptions {
  const config = yaml.load(readFileSync(rootPath, 'utf8')) as TOptions;
  return config;
}

/**
 * Writes public and private keys into the configuration.
 *
 * @param {string} publicKey - The public key to set in the configuration.
 * @param {string} privateKey - The private key to set in the configuration.
 * @returns {Promise<void>} - Promise indicating the completion of the write operation.
 */
export async function setKeys(
  publicKey: string,
  privateKey: string,
): Promise<void> {
  const config = getConfig();
  await writeConfig({ ...config, publicKey, privateKey });
}

/**
 * Retrieves the public and private keys from the configuration.
 *
 * @returns {Object} An object containing publicKey and privateKey.
 */
export function getKeys(): {
  publicKey: string | undefined;
  privateKey: string | undefined;
} {
  const config = getConfig();
  return { publicKey: config.publicKey, privateKey: config.privateKey };
}

/**
 * Checks if both `publicKey` and `privateKey` retrieved from `getKeys()` are present.
 *
 * @returns {boolean} - Returns `true` if both keys are present, otherwise returns `false`.
 */
export function hasKeys(): boolean {
  const { publicKey, privateKey } = getKeys();
  return Boolean(publicKey) && Boolean(privateKey);
}

/**
 * Writes the specified configuration to the root path.
 *
 * @param {TOptions} options - The configuration options to write.
 * @returns {Promise<void>} - Promise indicating the completion of the write operation.
 */
export async function writeConfig({
  publicKey,
  privateKey,
  chainId,
  network,
  networkId,
  networkHost,
  networkExplorerUrl,
  kadenaNamesApiEndpoint,
}: TOptions): Promise<void> {
  const defaultConfig = defaults[network as keyof IDefaultOptions];
  const config = mergeConfigs(
    { ...defaultConfig },
    {
      publicKey,
      privateKey,
      chainId,
      network,
      networkId,
      networkHost,
      networkExplorerUrl,
      kadenaNamesApiEndpoint,
    },
  );

  await writeFile(rootPath, yaml.dump(config), 'utf8' as BaseEncodingOptions);
}
