import { isNumeric } from '../../utils/helpers.js';
import { log } from '../../utils/logger.js';
import type { TableHeader, TableRow } from '../../utils/tableDisplay.js';

const formatLength = 80;

const displaySeparator = (): void => {
  log.info(log.color.green('-'.padEnd(formatLength, '-')));
};

export async function printTx(
  transactions: {
    fileName: string;
    signed: boolean;
  }[],
): Promise<void> {
  const header: TableHeader = ['Filename', 'Signed'];
  const rows: TableRow[] = [];

  if (transactions.length === 0) {
    log.info('No transactions found');
    return;
  }

  for (const transaction of transactions) {
    rows.push([
      transaction.fileName ?? 'N/A',
      transaction.signed === true ? 'Yes' : 'No',
    ]);
  }

  log.output(log.generateTableString(header, rows), transactions);
}

export function txDisplayTransaction(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obj: any,
  signedTransactionFiles: string[],
  header: string = '',
  baseIndent: number = 2, // Base indentation level for all lines
): void {
  if (header !== '') {
    displaySeparator();
    log.info(`  ${log.color.black(header.padEnd(formatLength - 2))}`);
    displaySeparator();
  }

  if (obj === null || obj === undefined) {
    log.info('Transaction '.repeat(baseIndent) + log.color.green('null'));
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
      log.info(log.color.black(formattedKey));
      for (const [subKey, subValue] of Object.entries(value)) {
        printObject(subKey, subValue, indentLevel + 2);
      }
    } else {
      let formattedValue =
        value !== null && value !== undefined ? value.toString() : 'null';

      if (key === 'status') {
        const color = value === 'failure' ? log.color.red : log.color.green;
        formattedValue = color(formattedValue);
      }
      log.info(
        `${log.color.black(formattedKey)} ${log.color.green(formattedValue)}`,
      );
    }
  };

  for (const [key, value] of Object.entries(obj)) {
    printObject(key, value, baseIndent);
  }

  displaySeparator();
}
