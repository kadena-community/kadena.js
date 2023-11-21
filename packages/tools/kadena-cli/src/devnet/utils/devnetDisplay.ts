import { defaultDevnetsPath, devnetDefaults } from '../../constants/devnets.js';
import { getExistingDevnets } from '../../utils/helpers.js';

import chalk from 'chalk';
import { existsSync, readFileSync } from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import type {
  ICustomDevnetsChoice,
  IDevnetsCreateOptions,
} from './devnetHelpers.js';

/**
 * Displays the devnet configuration in a formatted manner.
 *
 * @param {IDevnetsCreateOptions} devnetConfig - The devnet configuration to display.
 */
export function displayDevnetConfig(devnetConfig: IDevnetsCreateOptions): void {
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
    log(
      formatConfig('Pact folder mount', devnetConfig.mountPactFolder || 'N/A'),
    );
    log(formatConfig('kadena/devnet version', devnetConfig.version));
  });

  displaySeparator();
}
