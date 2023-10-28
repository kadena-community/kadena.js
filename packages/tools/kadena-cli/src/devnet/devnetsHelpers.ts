import { defaultDevnetsPath, devnetDefaults } from '../constants/devnets.js';
import { PathExists, writeFile } from '../utils/filesystem.js';
import {
  getExistingDevnets,
  mergeConfigs,
  sanitizeFilename,
} from '../utils/helpers.js';

import type { TDevnetsCreateOptions } from './devnetsCreateQuestions.js';

import chalk from 'chalk';
import type { WriteFileOptions } from 'fs';
import { existsSync, readFileSync, rmSync } from 'fs';
import yaml, { load } from 'js-yaml';
import path from 'path';

export interface ICustomDevnetsChoice {
  value: string;
  name?: string;
  description?: string;
  disabled?: boolean | string;
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
export function writeDevnets(options: TDevnetsCreateOptions): void {
  const { name } = options;
  const sanitizedName = sanitizeFilename(name).toLowerCase();
  const devnetFilePath = path.join(defaultDevnetsPath, `${sanitizedName}.yaml`);

  let existingConfig: TDevnetsCreateOptions;

  if (PathExists(devnetFilePath)) {
    existingConfig = yaml.load(
      readFileSync(devnetFilePath, 'utf8'),
    ) as TDevnetsCreateOptions;
  } else {
    // Explicitly check if devnet key exists in devnetDefaults and is not undefined
    existingConfig =
      typeof devnetDefaults[name] !== 'undefined'
        ? { ...devnetDefaults[name] }
        : { ...devnetDefaults.other };
  }

  const devnetConfig = mergeConfigs(existingConfig, options);

  devnetConfig.mountPactFolder = options.mountPactFolder;

  writeFile(
    devnetFilePath,
    yaml.dump(devnetConfig),
    'utf8' as WriteFileOptions,
  );
}

export function loadDevnet(name: string): TDevnetsCreateOptions | null {
  const devnetFilePath = path.join(defaultDevnetsPath, `${name}.yaml`);
  const fileExists = existsSync(devnetFilePath);

  if (!fileExists) {
    return null;
  }

  return yaml.load(
    readFileSync(devnetFilePath, 'utf8'),
  ) as TDevnetsCreateOptions;
}

export function removeDevnet(name: string): void {
  const devnetFilePath = path.join(defaultDevnetsPath, `${name}.yaml`);
  const fileExists = existsSync(devnetFilePath);

  if (!fileExists) {
    return;
  }

  rmSync(devnetFilePath);
}

/**
 * Displays the devnet configuration in a formatted manner.
 *
 * @param {TDevnetsCreateOptions} devnetConfig - The devnet configuration to display.
 */
export function displayDevnetConfig(devnetConfig: TDevnetsCreateOptions): void {
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

export function displayDevnetsConfig(): void {
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

  const existingDevnets: ICustomDevnetsChoice[] = getExistingDevnets();
  const standardDevnets: string[] = ['devnet'];

  existingDevnets.forEach(({ value }) => {
    const storedConfig = loadDevnet(value);
    const fileExists = storedConfig !== null;
    const devnetConfig = fileExists ? storedConfig : devnetDefaults[value];

    displaySeparator();
    log(formatConfig('Name', value, !fileExists));
    log(formatConfig('Port', devnetConfig.port?.toString(), !fileExists));
    log(
      formatConfig(
        'Volume',
        devnetConfig.useVolume ? `kadena_${devnetConfig.name}` : 'N/A',
        !fileExists,
      ),
    );
    log(
      formatConfig(
        'Pact folder mount',
        devnetConfig.mountPactFolder || 'N/A',
        !fileExists,
      ),
    );
    log(
      formatConfig('kadena/devnet version', devnetConfig.version, !fileExists),
    );
  });

  standardDevnets.forEach((devnet) => {
    if (!existingDevnets.some(({ value }) => value === devnet)) {
      const devnetConfig = devnetDefaults[devnet];
      displaySeparator();
      log(formatConfig('Name', devnet, true));
      log(formatConfig('Port', devnetConfig.port?.toString(), true));
      log(
        formatConfig(
          'Volume',
          devnetConfig.useVolume ? `kadena_${devnetConfig.name}` : 'N/A',
          true,
        ),
      );
      log(
        formatConfig(
          'Pact folder mount',
          devnetConfig.mountPactFolder || 'N/A',
          true,
        ),
      );
      log(formatConfig('kadena/devnet version', devnetConfig.version, true));
    }
  });

  displaySeparator();
}
