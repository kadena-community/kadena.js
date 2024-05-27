import {
  defaultDevnet,
  defaultDevnetsPath,
  devnetDefaults,
} from '../../constants/devnets.js';
import { mergeConfigs, sanitizeFilename } from '../../utils/globalHelpers.js';

import yaml from 'js-yaml';
import path from 'path';
import { services } from '../../services/index.js';

export interface ICustomDevnetsChoice {
  value: string;
  name?: string;
  description?: string;
  disabled?: boolean | string;
}

export interface IDevnetsCreateOptions {
  name: string;
  port: number;
  useVolume: boolean;
  mountPactFolder: string;
  version: string;
}

/**
 * Writes the given devnet setting to the devnet folder
 *
 * @param {TDevnetsCreateOptions} options - The set of configuration options.
 * @param {string} options.name - The name of your devnet container.
 * @param {number} options.port - The port to forward to the Chainweb node API.
 * @param {boolean} options.useVolume - Whether or not to mount a persistent volume to the container.
 * @param {string} options.mountPactFolder - The folder containing Pact files to mount to the container.
 * @param {string} options.version - The version of the kadena/devnet image to use.
 * @returns {void} - No return value; the function writes directly to a file.
 */
export async function writeDevnet(
  options: IDevnetsCreateOptions,
): Promise<void> {
  const { name } = options;
  const sanitizedDevnet = sanitizeFilename(name).toLowerCase();
  const devnetFilePath = path.join(
    defaultDevnetsPath,
    `${sanitizedDevnet}.yaml`,
  );

  let existingConfig: IDevnetsCreateOptions =
    typeof devnetDefaults[name] !== 'undefined'
      ? { ...devnetDefaults[name] }
      : { ...devnetDefaults.devnet };

  if (await services.filesystem.fileExists(devnetFilePath)) {
    const content = await services.filesystem.readFile(devnetFilePath);
    if (content !== null) {
      existingConfig = yaml.load(content) as IDevnetsCreateOptions;
    }
  }

  const devnetConfig = mergeConfigs(existingConfig, options);

  await services.filesystem.ensureDirectoryExists(path.dirname(devnetFilePath));
  await services.filesystem.writeFile(devnetFilePath, yaml.dump(devnetConfig));
}

/**
 * Removes the given devnet setting from the devnets folder
 *
 * @param {Pick<IDevnetsCreateOptions, 'name'>} options - The set of configuration options.
 * @param {string} options.name - The name of the devnet configuration.
 */
export async function removeDevnetConfiguration(
  options: Pick<IDevnetsCreateOptions, 'name'>,
): Promise<void> {
  const { name } = options;
  const sanitizedDevnet = sanitizeFilename(name).toLowerCase();
  const devnetFilePath = path.join(
    defaultDevnetsPath,
    `${sanitizedDevnet}.yaml`,
  );

  await services.filesystem.deleteFile(devnetFilePath);
}

export async function defaultDevnetIsConfigured(): Promise<boolean> {
  return await services.filesystem.fileExists(
    path.join(defaultDevnetsPath, `${defaultDevnet}.yaml`),
  );
}

export async function getDevnetConfiguration(
  name: string,
): Promise<IDevnetsCreateOptions | null> {
  const devnetFilePath = path.join(defaultDevnetsPath, `${name}.yaml`);

  const content = await services.filesystem.readFile(devnetFilePath);
  if (content === null) return null;

  return yaml.load(content) as IDevnetsCreateOptions;
}

export async function loadDevnetConfig(
  devnet: string,
): Promise<IDevnetsCreateOptions> {
  const devnetFilePath = path.join(defaultDevnetsPath, `${devnet}.yaml`);

  if (!(await services.filesystem.fileExists(devnetFilePath))) {
    throw new Error('Devnet configuration file not found.');
  }

  return yaml.load(
    (await services.filesystem.readFile(devnetFilePath))!,
  ) as IDevnetsCreateOptions;
}
