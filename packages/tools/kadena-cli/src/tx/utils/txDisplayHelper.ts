import chalk from 'chalk';
import { isNumeric } from '../../utils/helpers.js';

const formatLength = 80;

const displaySeparator = (): void => {
  console.log(chalk.green('-'.padEnd(formatLength, '-')));
};

export function txDisplayTransaction(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obj: any,
  signedTransactionFiles: string[],
  header: string = '',
  baseIndent: number = 2, // Base indentation level for all lines
): void {
  if (header !== '') {
    displaySeparator();
    console.log(`  ${chalk.black(header.padEnd(formatLength - 2))}`);
    displaySeparator();
  }

  if (obj === null || obj === undefined) {
    console.log('Transaction '.repeat(baseIndent) + chalk.green('null'));
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const printObject = (key: string, value: any, indentLevel: number): void => {
    const output =
      isNumeric(key) && parseInt(key, 10) < signedTransactionFiles.length
        ? signedTransactionFiles[parseInt(key, 10)]
        : key;
    const formattedKey = `${' '.repeat(indentLevel)}${output}:`;

    if (typeof value === 'object' && value !== null) {
      console.log(chalk.black(formattedKey));
      for (const [subKey, subValue] of Object.entries(value)) {
        printObject(subKey, subValue, indentLevel + 2);
      }
    } else {
      let formattedValue =
        value !== null && value !== undefined ? value.toString() : 'null';

      if (key === 'status') {
        const color = value === 'failure' ? chalk.red : chalk.green;
        formattedValue = color(formattedValue);
      }
      console.log(
        `${chalk.black(formattedKey)} ${chalk.green(formattedValue)}`,
      );
    }
  };

  for (const [key, value] of Object.entries(obj)) {
    printObject(key, value, baseIndent);
  }

  displaySeparator();
}
