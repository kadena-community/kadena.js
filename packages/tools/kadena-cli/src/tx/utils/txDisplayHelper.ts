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

    if (
      value !== undefined &&
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value)
    ) {
      console.log(`${chalk.black(formattedKey)}`);

      if (key === 'result' && 'status' in value) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const resultValue = value as { status: string; [key: string]: any };
        const color =
          resultValue.status === 'failure' ? chalk.red : chalk.green;
        console.log(
          ' '.repeat(baseIndent * 2) +
            color(JSON.stringify(resultValue, null, 2)),
        );
      } else {
        console.log(
          ' '.repeat(baseIndent * 2) +
            chalk.green(JSON.stringify(value, null, 2)),
        );
      }
    } else {
      const formattedValue =
        value !== null && value !== undefined ? value.toString() : 'null';
      console.log(
        `${chalk.black(formattedKey)} ${chalk.green(formattedValue)}`,
      );
    }
  }

  displaySeparator();
}
