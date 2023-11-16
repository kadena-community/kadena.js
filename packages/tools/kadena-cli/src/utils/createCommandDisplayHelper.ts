import chalk from 'chalk';

export const formatLength: 80 = 80;
export const formatConfig = (key: string, value?: string | number): string => {
  const valueDisplay =
    value === undefined ? chalk.red('Not Set') : chalk.green(value.toString());
  const keyValue = `${key}: ${valueDisplay}`;
  const remainingWidth =
    formatLength - keyValue.length > 0 ? formatLength - keyValue.length : 0;
  return `  ${keyValue}${' '.repeat(remainingWidth)}  `;
};

export const displayConfig = (
  config: Record<string, string | number | object>,
  indentation: string = '',
): void => {
  Object.getOwnPropertyNames(config).forEach((key) => {
    const value = config[key];
    const isArray = Array.isArray(value);
    const displayValue = isArray ? JSON.stringify(value) : value;
    const isObject = typeof displayValue === 'object';
    console.log(formatConfig(indentation + key, isObject ? '' : displayValue));
    if (isObject) {
      displayConfig(
        displayValue as unknown as Record<string, string | number | object>,
        `${indentation}  `,
      );
    }
  });
};
