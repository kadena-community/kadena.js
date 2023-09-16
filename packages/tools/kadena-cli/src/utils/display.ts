import type { IDefaultConfigOptions } from '../constants/config';

import chalk from 'chalk';

interface IFullConfiguration {
  contexts: Record<string, IDefaultConfigOptions>;
}

type ConfigType = IDefaultConfigOptions | IFullConfiguration;

/**
 * Checks if the provided config is a full configuration with contexts.
 *
 * @param config The configuration object to check.
 * @returns True if it's a full configuration, false otherwise.
 */
function isFullConfiguration(config: ConfigType): config is IFullConfiguration {
  return 'contexts' in config;
}

/**
 * Displays the configuration summary based on provided keys or in full.
 *
 * @param {ConfigType} config - The configuration object to display.
 * @param {Array<keyof IDefaultConfigOptions>} [propertyKeys] - The keys of the properties to display. If not provided, all properties are displayed.
 *
 * @example
 *
 * // Displaying a single context configuration in full
 * const singleConfig = {...};
 * displayConfig(singleConfig);
 *
 * // Displaying a full configuration with all contexts
 * const fullConfig = { contexts: {...} };
 * displayConfig(fullConfig);
 *
 * // Displaying specific properties of a single context configuration
 * displayConfig(singleConfig, ['publicKey', 'networkHost']);
 *
 */
export function displayConfig(
  config: ConfigType,
  propertyKeys?: Array<keyof IDefaultConfigOptions>,
): void {
  const log = console.log;
  const formatLength = 80;

  const formatConfig = (
    key: string,
    value: string | number | boolean,
  ): string => {
    const keyValue = `${key}: ${chalk.green(String(value))}`;
    const remainingWidth =
      formatLength - keyValue.length > 0 ? formatLength - keyValue.length : 0;
    return `  ${keyValue}${' '.repeat(remainingWidth)}  `;
  };

  const displaySeparator = (): void => {
    log(chalk.green('-'.padEnd(formatLength, '-')));
  };

  const displayProperties = (cfg: IDefaultConfigOptions): void => {
    if (propertyKeys) {
      propertyKeys.forEach((key) => {
        if (key in cfg) {
          log(formatConfig(key, String(cfg[key])));
        }
      });
    } else {
      Object.entries(cfg).forEach(([key, value]) => {
        log(formatConfig(key, String(value)));
      });
    }
  };

  if (isFullConfiguration(config)) {
    displaySeparator();
    for (const [context, contextConfig] of Object.entries(config.contexts)) {
      log(chalk.green(`Context: ${context}`));
      displaySeparator();
      displayProperties(contextConfig);
      displaySeparator();
    }
  } else {
    const title = `${'  Configuration Options'.padEnd(formatLength, '  ')} `;
    displaySeparator();
    log(chalk.green(title));
    displaySeparator();
    displayProperties(config);
    displaySeparator();
  }
}

/**
 * Displays the current context in a formatted manner.
 *
 * @param {string} context - The context name to display.
 */
export function displayContext(context: string): void {
  const log = console.log;
  const formatLength = 80; // Maximum width for the display

  const displaySeparator = (): void => {
    log(chalk.green('-'.padEnd(formatLength, '-')));
  };

  const formatContext = (key: string, value: string): string => {
    const keyValue = `${key}: ${chalk.green(value)}`;
    const remainingWidth =
      formatLength - keyValue.length > 0 ? formatLength - keyValue.length : 0;
    return `  ${keyValue}${' '.repeat(remainingWidth)}  `;
  };

  displaySeparator();
  log(formatContext('Current Context', context));
  displaySeparator();
}
