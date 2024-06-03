import {
  defaultDevnetsPath,
  devnetDefaults,
} from '../../../constants/devnets.js';
import { getExistingDevnets } from '../../../utils/helpers.js';

import yaml from 'js-yaml';
import path from 'path';
import { services } from '../../../services/index.js';
import { log } from '../../../utils/logger.js';
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
  const formatLength = 80; // Maximum width for the display

  const displaySeparator = (): void => {
    log.info(log.color.green('-'.padEnd(formatLength, '-')));
  };

  const formatConfig = (key: string, value?: string): string => {
    const valueDisplay =
      value !== undefined && value.trim() !== ''
        ? log.color.green(value)
        : log.color.red('Not Set');
    const keyValue = `${key}: ${valueDisplay}`;
    const remainingWidth =
      formatLength - keyValue.length > 0 ? formatLength - keyValue.length : 0;
    return `  ${keyValue}${' '.repeat(remainingWidth)}  `;
  };

  displaySeparator();
  log.info(formatConfig('Name', devnetConfig.name));
  log.info(formatConfig('Port', devnetConfig.port?.toString()));
  log.info(
    formatConfig(
      'Volume',
      devnetConfig.useVolume ? `kadena_${devnetConfig.name}` : 'N/A',
    ),
  );
  log.info(
    formatConfig('Pact folder mount', devnetConfig.mountPactFolder ?? 'N/A'),
  );
  log.info(formatConfig('kadena/devnet version', devnetConfig.version));
  displaySeparator();
}

export async function displayDevnetsConfig(): Promise<void> {
  const formatLength = 80; // Maximum width for the display

  const displaySeparator = (): void => {
    log.info(log.color.green('-'.padEnd(formatLength, '-')));
  };

  const formatConfig = (
    key: string,
    value?: string,
    isDefault?: boolean,
  ): string => {
    const valueDisplay =
      (value?.trim() ?? '') !== ''
        ? log.color.green(value!)
        : log.color.red('Not Set');

    const defaultIndicator =
      isDefault === true ? log.color.yellow(' (Using defaults)') : '';
    const keyValue = `${key}: ${valueDisplay}${defaultIndicator}`;
    const remainingWidth =
      formatLength - keyValue.length > 0 ? formatLength - keyValue.length : 0;
    return `  ${keyValue}${' '.repeat(remainingWidth)}  `;
  };

  const existingDevnets: ICustomDevnetsChoice[] = await getExistingDevnets();

  for (const { value } of existingDevnets) {
    const devnetFilePath = path.join(defaultDevnetsPath, `${value}.yaml`);
    const fileContent = await services.filesystem.readFile(devnetFilePath);
    const devnetConfig =
      fileContent !== null
        ? (yaml.load(fileContent) as IDevnetsCreateOptions)
        : devnetDefaults[value];

    displaySeparator();
    log.info(formatConfig('Name', devnetConfig.name));
    log.info(formatConfig('Port', devnetConfig.port?.toString()));
    log.info(
      formatConfig(
        'Volume',
        devnetConfig.useVolume ? `kadena_${devnetConfig.name}` : 'N/A',
      ),
    );
    log.info(
      formatConfig('Pact folder mount', devnetConfig.mountPactFolder ?? 'N/A'),
    );
    log.info(formatConfig('kadena/devnet version', devnetConfig.version));
  }

  displaySeparator();
}
