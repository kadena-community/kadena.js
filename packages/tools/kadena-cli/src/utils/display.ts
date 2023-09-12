import { TOptions } from '../config/initCommand';

import chalk from 'chalk';
/**
 * Displays the configuration summary in a formatted manner.
 *
 * @param {TOptions} config - The configuration object to display.
 *
 * @example
 * const config = {
 *   publicKey: '123ABC',
 *   privateKey: 'XYZ789',
 *   // ... other properties
 * };
 * displayConfig(config);
 */
export function displayConfig(config: TOptions): void {
  const log = console.log;
  const formatLength = 80; // Maximum width for the display
  const title = `${'  Configuration Options'.padEnd(formatLength, '  ')} `;

  /**
   * Formats the configuration key-value pair into a string.
   *
   * @param {string} key - The configuration key.
   * @param {string | number | boolean} value - The configuration value.
   * @returns {string} - The formatted configuration string.
   */
  const formatConfig = (
    key: string,
    value: string | number | boolean,
  ): string => {
    const keyValue = `${key}: ${chalk.green(String(value))}`;
    const remainingWidth =
      formatLength - keyValue.length > 0 ? formatLength - keyValue.length : 0; // Subtract 2 for the borders
    return `  ${keyValue}${' '.repeat(remainingWidth)}  `;
  };

  log(chalk.green('-'.padEnd(formatLength, '-')));
  log(chalk.green(title));
  log(chalk.green('-'.padEnd(formatLength, '-')));

  Object.entries(config).forEach(([key, value]) => {
    log(formatConfig(key, value));
  });

  log(chalk.green('-'.padEnd(formatLength, '-')));
}
