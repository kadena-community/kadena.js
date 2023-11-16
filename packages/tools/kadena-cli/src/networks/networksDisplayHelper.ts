import chalk from 'chalk';
import { existsSync, readFileSync } from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import { defaultNetworksPath, networkDefaults } from '../constants/networks.js';
import { getExistingNetworks } from '../utils/helpers.js';
import type {
  ICustomNetworksChoice,
  INetworksCreateOptions,
} from './networksHelpers.js';

/**
 * Displays the network configuration in a formatted manner.
 *
 * @param {INetworksCreateOptions} networkConfig - The network configuration to display.
 */
export function displayNetworkConfig(
  networkConfig: INetworksCreateOptions,
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
  log(formatConfig('Network', networkConfig.network));
  log(formatConfig('Network ID', networkConfig.networkId));
  log(formatConfig('Network Host', networkConfig.networkHost));
  log(formatConfig('Network Explorer URL', networkConfig.networkExplorerUrl));
  displaySeparator();
}

export function displayNetworksConfig(): void {
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

  const existingNetworks: ICustomNetworksChoice[] = getExistingNetworks();

  existingNetworks.forEach(({ value }) => {
    const networkFilePath = path.join(defaultNetworksPath, `${value}.yaml`);
    const fileExists = existsSync(networkFilePath);
    const networkConfig = fileExists
      ? (yaml.load(
          readFileSync(networkFilePath, 'utf8'),
        ) as INetworksCreateOptions)
      : networkDefaults[value];

    displaySeparator();
    log(formatConfig('Network', value, !fileExists));
    log(formatConfig('Network ID', networkConfig.networkId, !fileExists));
    log(formatConfig('Network Host', networkConfig.networkHost, !fileExists));
    log(
      formatConfig(
        'Network Explorer URL',
        networkConfig.networkExplorerUrl,
        !fileExists,
      ),
    );
  });

  displaySeparator();
}
