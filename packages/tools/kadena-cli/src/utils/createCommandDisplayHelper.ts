import chalk from 'chalk';

export const formatLength: 80 = 80;

export const displaySeparator = (): void => {
  console.log(chalk.green('-'.repeat(formatLength)));
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
  displaySeparator(); // Add horizontal line at the bottom
};
