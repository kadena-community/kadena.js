import {
  defaultNetworksPath,
  networkDefaults,
} from '../../constants/networks.js';

import { getExistingNetworks } from '../../utils/helpers.js';
import type {
  ICustomNetworkChoice,
  INetworkCreateOptions,
} from './networkHelpers.js';

import chalk from 'chalk';

import { existsSync, readFileSync } from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import { log } from '../../utils/logger.js';

/**
 * Displays the network configuration in a formatted manner.
 *
 * @param {TNetworksCreateOptions} networkConfig - The network configuration to display.
 */
export function displayNetworkConfig(
  networkConfig: INetworkCreateOptions,
): void {
  const formatLength = 80; // Maximum width for the display

  const displaySeparator = (): void => {
    log.info(chalk.green('-'.padEnd(formatLength, '-')));
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
  log.info(formatConfig('Network', networkConfig.network));
  log.info(formatConfig('Network ID', networkConfig.networkId));
  log.info(formatConfig('Network Host', networkConfig.networkHost));
  log.info(
    formatConfig('Network Explorer URL', networkConfig.networkExplorerUrl),
  );
  displaySeparator();
}

export function displayNetworksConfig(): void {
  const formatLength = 80; // Maximum width for the display

  const displaySeparator = (): void => {
    log.info(chalk.green('-'.padEnd(formatLength, '-')));
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

  const existingNetworks: ICustomNetworkChoice[] = getExistingNetworks();
  const standardNetworks: string[] = ['mainnet', 'testnet'];

  existingNetworks.forEach(({ value }) => {
    const networkFilePath = path.join(defaultNetworksPath, `${value}.yaml`);
    const fileExists = existsSync(networkFilePath);
    const networkConfig = fileExists
      ? (yaml.load(
          readFileSync(networkFilePath, 'utf8'),
        ) as INetworkCreateOptions)
      : networkDefaults[value];

    displaySeparator();
    log.info(formatConfig('Network', value, !fileExists));
    log.info(formatConfig('Network ID', networkConfig.networkId, !fileExists));
    log.info(
      formatConfig('Network Host', networkConfig.networkHost, !fileExists),
    );
    log.info(
      formatConfig(
        'Network Explorer URL',
        networkConfig.networkExplorerUrl,
        !fileExists,
      ),
    );
  });

  standardNetworks.forEach((network) => {
    if (!existingNetworks.some(({ value }) => value === network)) {
      const networkConfig = networkDefaults[network];
      displaySeparator();
      log.info(formatConfig('Network', network, true)); // as it is a standard network and does not exist in existingNetworks
      log.info(formatConfig('Network ID', networkConfig.networkId, true));
      log.info(formatConfig('Network Host', networkConfig.networkHost, true));
      log.info(
        formatConfig(
          'Network Explorer URL',
          networkConfig.networkExplorerUrl,
          true,
        ),
      );
    }
  });

  displaySeparator();
}
