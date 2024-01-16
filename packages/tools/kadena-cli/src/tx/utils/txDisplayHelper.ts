import chalk from 'chalk';

const formatLength = 80;

const displaySeparator = (): void => {
  console.log(chalk.green('-'.padEnd(formatLength, '-')));
};

export function txDisplaySingleLine(message: string): void {
  console.log(`  ${chalk.green(message.padEnd(formatLength - 2))}  \n`);
  displaySeparator();
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function txDisplayTransaction(obj: any, indent: number = 0): void {
  const indentation = ' '.repeat(indent);
  if (obj === null || obj === undefined) {
    console.log(indentation + chalk.green('null'));
    return;
  }

  if (typeof obj !== 'object' || Array.isArray(obj)) {
    console.log(indentation + chalk.green(JSON.stringify(obj, null, 2)));
    return;
  }

  for (const [key, value] of Object.entries(obj)) {
    const formattedKey = `${indentation}${key}:`.padEnd(formatLength - 2);
    console.log(`  ${chalk.black(formattedKey)}`);

    if (typeof value === 'object' && value !== null) {
      console.log(`    ${chalk.green(JSON.stringify(value, null, 2))}`);
    } else {
      console.log(`    ${chalk.green(JSON.stringify(value))}`);
    }
  }
  displaySeparator();
}
