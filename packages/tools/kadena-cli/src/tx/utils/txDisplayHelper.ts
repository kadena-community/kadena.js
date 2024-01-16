import chalk from 'chalk';

const formatLength = 80;

const displaySeparator = (): void => {
  console.log(chalk.green('-'.padEnd(formatLength, '-')));
};

export function txDisplayTransaction(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obj: any,
  header: string = '',
  baseIndent: number = 2, // Base indentation level for all lines
): void {
  if (header !== '') {
    displaySeparator();
    console.log(`  ${chalk.black(header.padEnd(formatLength - 2))}`);
    displaySeparator();
  }

  if (obj === null || obj === undefined) {
    console.log(' '.repeat(baseIndent) + chalk.green('null'));
    return;
  }

  if (typeof obj !== 'object' || Array.isArray(obj)) {
    console.log(
      ' '.repeat(baseIndent) + chalk.green(JSON.stringify(obj, null, 2)),
    );
    return;
  }

  for (const [key, value] of Object.entries(obj)) {
    const formattedKey = `${' '.repeat(baseIndent)}${key}:`;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      console.log(`${chalk.black(formattedKey)}`);
      console.log(
        ' '.repeat(baseIndent * 2) +
          chalk.green(JSON.stringify(value, null, 2)),
      );
    } else {
      const formattedValue =
        value !== null && value !== undefined
          ? chalk.green(value.toString())
          : chalk.green('null');
      console.log(`${chalk.black(formattedKey)} ${formattedValue}`);
    }
  }
  displaySeparator();
}
