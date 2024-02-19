import chalk from 'chalk';
import { log } from './logger.js';

export const formatLength: 80 = 80;

export const displaySeparator = (): void => {
  log.info(chalk.green('-'.repeat(formatLength)));
};

export const formatConfig = (key: string, value?: string | number): string => {
  let valueDisplay;
  if (value === undefined) {
    valueDisplay = chalk.red('Not Set');
  } else if (key.toLowerCase().includes('password')) {
    if (value === '') {
      valueDisplay = 'no password set';
    } else {
      valueDisplay = chalk.red('******');
    }
  } else {
    valueDisplay = chalk.green(value.toString());
  }
  const keyValue = `${key} : ${valueDisplay}`;
  const remainingWidth =
    formatLength - keyValue.length > 0 ? formatLength - keyValue.length : 0;
  return `  ${keyValue}${' '.repeat(remainingWidth)}  `;
};

export const displayConfig = (
  config: Record<string, string | number | object>,
  indentation: string = '',
): void => {
  displaySeparator(); // Add horizontal line at the top
  Object.getOwnPropertyNames(config).forEach((key) => {
    const value = config[key];
    let isObject = false;
    let displayValue = value as string;

    if (Array.isArray(value)) {
      displayValue = JSON.stringify(value);
    } else if (value === null) {
      displayValue = 'null';
    } else if (typeof value === 'object') {
      isObject = true;
      displayValue = '';
    }

    log.info(formatConfig(indentation + key, displayValue));

    if (isObject) {
      displayConfig(
        value as unknown as Record<string, string | number | object>,
        `${indentation}  `,
      );
    }
  });
  if (indentation.length === 0) displaySeparator(); // Add horizontal line at the bottom
};
