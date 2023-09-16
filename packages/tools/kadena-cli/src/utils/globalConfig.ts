import { TConfigOptions } from '../config/configOptions';
import {
  Context,
  defaultContext,
  defaults,
  IContext,
  IDefaultConfigOptions,
  IDefaultOptions,
  rootPath,
} from '../constants/config';
import { ensureFileExists, PathExists, writeFile } from '../utils/filesystem';
import { mergeConfigs } from '../utils/helpers';

import chalk from 'chalk';
import { BaseEncodingOptions, readFileSync } from 'fs';
import yaml from 'js-yaml';
import path from 'path';

/**
 * Creates an IContext object using the provided context.
 *
 * @param {Context} context - The context to create the IContext object from.
 * @returns {IContext} - The merged configuration object as an IContext.
 */
function makeContext(context: Context): IContext {
  return {
    currentContext: context,
  } as IContext;
}

/**
 * Sets the current context in the 'context.yaml' file.
 *
 * @param {Context} currentContext - The context to set.
 * @returns {void} - The function writes directly to a file and doesn't return a value.
 */
export function setContext(currentContext: Context): void {
  const filePath = path.join(rootPath, 'context.yaml');
  writeFile(
    filePath,
    yaml.dump(makeContext(currentContext)),
    'utf8' as BaseEncodingOptions,
  );
}

/**
 * Retrieves the current context. If no context is found, it initializes with 'mainnet'.
 *
 * @returns {Context} - The current context (e.g., 'mainnet', 'testnet', etc.).
 * @throws {Error} If the context hasn't been set yet.
 */
export function getContextOrCreateInitial(): Context {
  const filePath = path.join(rootPath, 'context.yaml');
  if (!ensureFileExists(filePath)) {
    setContext(defaultContext);
  }
  const context = yaml.load(readFileSync(`${rootPath}/context.yaml`, 'utf8'));
  const { currentContext } = context as IContext;
  if (!currentContext) {
    throw new Error('Context has not been set yet!');
  }
  return currentContext;
}

/**
 * Retrieves the current context from the configuration file.
 *
 * @returns {Context} - The current context (e.g., 'mainnet', 'testnet', etc.).
 * @throws {Error} If the context hasn't been set yet.
 */
export function getContext(): Context {
  const filePath = path.join(rootPath, 'context.yaml');

  if (!ensureFileExists(filePath)) {
    throw new Error('Context file does not exist!');
  }

  const contextContent = readFileSync(filePath, 'utf8');
  const contextObj = yaml.load(contextContent) as IContext;

  if (!contextObj.currentContext) {
    throw new Error('Context has not been set yet!');
  }

  return contextObj.currentContext;
}

/**
 * Loads and returns the current configuration from the default root path.
 *
 * @returns {IDefaultConfigOptions} - The parsed configuration object.
 */
export function getConfig(): IDefaultConfigOptions {
  const context = getContextOrCreateInitial();
  const filePath = path.join(rootPath, 'config.yaml');

  try {
    const config = yaml.load(readFileSync(filePath, 'utf8')) as IDefaultOptions;
    return config.contexts[context as Context];
  } catch (e) {
    chalk.red('initial load, loading defaults..');
    return defaults.contexts[context as Context];
  }
}

/**
 * Retrieves the full configuration from the `config.yaml` file.
 *
 * @returns {IDefaultOptions} The parsed configuration from the `config.yaml` file.
 *
 * @throws {Error} If there is an issue reading or parsing the `config.yaml` file.
 *
 */
export function getFullConfig(): IDefaultOptions {
  const filePath = path.join(rootPath, 'config.yaml');
  try {
    const config = yaml.load(readFileSync(filePath, 'utf8')) as IDefaultOptions;
    return config;
  } catch (error) {
    throw new Error(
      `Failed to retrieve configuration from ${filePath}: ${error.message}`,
    );
  }
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
  const currentContext = getContext();
  const config = getConfig();
  writeConfig({ ...config, context: currentContext, publicKey, privateKey });
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
 * Writes the given configuration to the root path's configuration file.
 *
 * @param {TConfigOptions} options - The set of configuration options.
 * @param {string} options.context - The context (e.g., 'mainnet', 'testnet') for the config.
 * @param {string} options.publicKey - The public key to store.
 * @param {string} options.privateKey - The private key to store.
 * @param {number} options.chainId - The ID representing the chain.
 * @param {number} options.networkId - The ID representing the network.
 * @param {string} options.networkHost - The hostname for the network.
 * @param {string} options.networkExplorerUrl - The URL for the network explorer.
 * @param {string} options.kadenaNamesApiEndpoint - The API endpoint for Kadena names.
 * @returns {void} - No return value; the function writes directly to a file.
 */
export function writeConfig(options: TConfigOptions): void {
  const { context } = options;
  const filePath = path.join(rootPath, 'config.yaml');
  // 1. Load existing configs if file exists, or fallback to defaults.
  const existingConfig: IDefaultOptions = (PathExists(filePath) as boolean)
    ? (yaml.load(readFileSync(filePath, 'utf8')) as IDefaultOptions)
    : { ...defaults };

  // 2. Update the specific context with provided values, falling back to defaults.
  const updatedConfigForContext = mergeConfigs(
    defaults.contexts[context],
    options,
  );

  existingConfig.contexts[context] = updatedConfigForContext;

  writeFile(filePath, yaml.dump(existingConfig), 'utf8' as BaseEncodingOptions);
}
