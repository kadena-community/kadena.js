import { defaultDevnet, defaultDevnetsPath, devnetDefaults } from '../constants/devnets.js';
import { PathExists, removeFile, writeFile } from '../utils/filesystem.js';
import {
  getExistingDevnets,
  mergeConfigs,
  sanitizeFilename,
} from '../utils/helpers.js';

import chalk from 'chalk';
import type { WriteFileOptions } from 'fs';
import { existsSync, readFileSync } from 'fs';
import yaml from 'js-yaml';
import path from 'path';

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
export function writeDevnet(options: IDevnetsCreateOptions): void {
  const { name } = options;
  const sanitizedDevnet = sanitizeFilename(name).toLowerCase();
  const devnetFilePath = path.join(
    defaultDevnetsPath,
    `${sanitizedDevnet}.yaml`,
  );

  let existingConfig: IDevnetsCreateOptions;

  if (PathExists(devnetFilePath)) {
    existingConfig = yaml.load(
      readFileSync(devnetFilePath, 'utf8'),
    ) as IDevnetsCreateOptions;
  } else {
    // Explicitly check if devnet key exists in devnetDefaults and is not undefined
    existingConfig =
      typeof devnetDefaults[name] !== 'undefined'
        ? { ...devnetDefaults[name] }
        : { ...devnetDefaults.other };
  }

  const devnetConfig = mergeConfigs(existingConfig, options);

  writeFile(
    devnetFilePath,
    yaml.dump(devnetConfig),
    'utf8' as WriteFileOptions,
  );
}

/**
 * Removes the given devnet setting from the devnets folder
 *
 * @param {Pick<IDevnetsCreateOptions, 'name'>} options - The set of configuration options.
 * @param {string} options.name - The name of the devnet configuration.
 */
export function removeDevnetConfiguration(options: Pick<IDevnetsCreateOptions, 'name'>): void {
  const { name } = options;
  const sanitizedDevnet = sanitizeFilename(name).toLowerCase();
  const devnetFilePath = path.join(
    defaultDevnetsPath,
    `${sanitizedDevnet}.yaml`,
  );

  removeFile(devnetFilePath);
}

export function defaultDevnetIsConfigured(): boolean {
  return PathExists(path.join(defaultDevnetsPath, `${defaultDevnet}.yaml`));
}

export function getDevnetConfiguration(name: string): IDevnetsCreateOptions | null {
  const devnetFilePath = path.join(defaultDevnetsPath, `${name}.yaml`);

  if (! PathExists(devnetFilePath)) {
    return null;
  }

  return yaml.load(readFileSync(devnetFilePath, 'utf8')) as IDevnetsCreateOptions;
}

/**
 * Displays the devnet configuration in a formatted manner.
 *
 * @param {IDevnetsCreateOptions} devnetConfig - The devnet configuration to display.
 */
export function displayDevnetConfig(
  devnetConfig: IDevnetsCreateOptions,
): void {
  const log = console.log;
  const formatLength = 80; // Maximum width for the display

  const displaySeparator = (): void => {
    log(chalk.green('-'.padEnd(formatLength, '-')));
  };

  const formatConfig = (key: string, value?: string): string => {
    const valueDisplay =
      value !== undefined && value.trim() !== ''
        ? chalk.green(value)
        : chalk.red('Not Set');
    const keyValue = `${key}: ${valueDisplay}`;
    const remainingWidth =
      formatLength - keyValue.length > 0 ? formatLength - keyValue.length : 0;
    return `  ${keyValue}${' '.repeat(remainingWidth)}  `;
  };

  displaySeparator();
  log(formatConfig('Name', devnetConfig.name));
  log(formatConfig('Port', devnetConfig.port?.toString()));
  log(
    formatConfig(
      'Volume',
      devnetConfig.useVolume ? `kadena_${devnetConfig.name}` : 'N/A',
    ),
  );
  log(formatConfig('Pact folder mount', devnetConfig.mountPactFolder || 'N/A'));
  log(formatConfig('kadena/devnet version', devnetConfig.version));
  displaySeparator();
}

export function loadDevnetConfig(devnet: string): IDevnetsCreateOptions | never {
  const devnetFilePath = path.join(defaultDevnetsPath, `${devnet}.yaml`);

  if (! existsSync(devnetFilePath)) {
    throw new Error('Devnet configuration file not found.')
  }

  return (yaml.load(
    readFileSync(devnetFilePath, 'utf8'),
  ) as IDevnetsCreateOptions);
}

export async function displayDevnetsConfig(): Promise<void> {
  const log = console.log;
  const formatLength = 80; // Maximum width for the display

  const displaySeparator = (): void => {
    log(chalk.green('-'.padEnd(formatLength, '-')));
  };

  const formatConfig = (
    key: string,
    value?: string,
    isDefault?: boolean,
  ): string => {
    const valueDisplay =
      (value?.trim() ?? '') !== '' ? chalk.green(value!) : chalk.red('Not Set');

    const defaultIndicator =
      isDefault === true ? chalk.yellow(' (Using defaults)') : '';
    const keyValue = `${key}: ${valueDisplay}${defaultIndicator}`;
    const remainingWidth =
      formatLength - keyValue.length > 0 ? formatLength - keyValue.length : 0;
    return `  ${keyValue}${' '.repeat(remainingWidth)}  `;
  };


  const existingDevnets: ICustomDevnetsChoice[] = await getExistingDevnets();

  existingDevnets.forEach(({ value }) => {
    const devnetFilePath = path.join(defaultDevnetsPath, `${value}.yaml`);
    const fileExists = existsSync(devnetFilePath);
    const devnetConfig = fileExists
      ? (yaml.load(
          readFileSync(devnetFilePath, 'utf8'),
        ) as IDevnetsCreateOptions)
      : devnetDefaults[value];

    displaySeparator();
    log(formatConfig('Name', devnetConfig.name));
    log(formatConfig('Port', devnetConfig.port?.toString()));
    log(
      formatConfig(
        'Volume',
        devnetConfig.useVolume ? `kadena_${devnetConfig.name}` : 'N/A',
      ),
    );
    log(formatConfig('Pact folder mount', devnetConfig.mountPactFolder || 'N/A'));
    log(formatConfig('kadena/devnet version', devnetConfig.version));
  });

  displaySeparator();
}
