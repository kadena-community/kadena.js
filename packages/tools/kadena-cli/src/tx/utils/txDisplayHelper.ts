import type { ICommandResult } from '@kadena/client';
import type { ICommand, IUnsignedCommand } from '@kadena/types';
import { log } from '../../utils/logger.js';
import { createTable } from '../../utils/table.js';
import type { INetworkDetails, ISubmitResponse } from '../utils/txHelpers.js';

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
  const table = createTable({
    head: ['Filename', 'Signed'],
  });

  if (transactions.length === 0) {
    log.info('No transactions found');
    return;
  }

  for (const transaction of transactions) {
    table.push([
      transaction.fileName ?? 'N/A',
      transaction.signed === true ? 'Yes' : 'No',
    ]);
  }

  log.output(table.toString(), transactions);
}

export function txDisplayTransaction(
  data: { transactions: ISubmitResponse[] },
  files: string[],
  header: string = '',
  baseIndent: number = 2,
): void {
  if (header !== '') {
    displaySeparator();
    log.info(`  ${log.color.black(header.padEnd(formatLength - 2))}`);
    displaySeparator();
  }

  if (
    data === undefined ||
    data.transactions === undefined ||
    data.transactions.length === 0
  ) {
    log.info('Transaction '.repeat(baseIndent) + log.color.green('null'));
    return;
  }

  data.transactions.forEach((item: ISubmitResponse, i: number) => {
    displayCustomTransactionInfo(
      {
        fileName: files[i],
        transactionHash: item.transaction.hash,
      },
      baseIndent,
    );
    log.info('\n');
    if (item.response) {
      log.info(log.color.black(`${' '.repeat(baseIndent)}Response:`));
      displayTransactionResponse(item.response, baseIndent + 2);
    }
    log.info('\n');
    displayTransactionDetails(item.details, baseIndent);
    log.info('\n');
    displayTransactionCommand(item.transaction, baseIndent);
    displaySeparator();
  });
}

export function displayCustomTransactionInfo(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info: any,
  indentLevel: number,
): void {
  log.info(log.color.green(`${' '.repeat(indentLevel)}Transaction info:`));
  printObject(info, indentLevel + 2);
}

function displayTransactionDetails(
  details: INetworkDetails,
  indentLevel: number,
): void {
  log.info(log.color.black(`${' '.repeat(indentLevel)}Details:`));
  printObject(details, indentLevel + 2);
}

export function displayTransactionResponse(
  response: ICommandResult,
  indentLevel: number,
): void {
  log.info(log.color.black(`${' '.repeat(indentLevel)}Response:`));
  printObject(response, indentLevel + 2);
}

export function displayTransactionCommand(
  transaction: ICommand | IUnsignedCommand,
  indentLevel: number,
): void {
  log.info(log.color.black(`${' '.repeat(indentLevel)}Transaction Command:`));
  printObject(transaction, indentLevel + 2);
}

function printObject(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obj: any,
  indentLevel: number,
): void {
  const indentString = ' '.repeat(indentLevel);

  if (typeof obj !== 'object' || obj === null) {
    log.info(`${indentString}${obj}`);
    return;
  }

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      log.info(`${indentString}[${index}]:`);
      printObject(item, indentLevel + 2);
    });
  } else {
    Object.entries(obj).forEach(([key, value]) => {
      const formattedKey = `${key}:`.padStart(key.length + indentLevel + 2);
      if (typeof value === 'object' && value !== null) {
        log.info(log.color.black(formattedKey));
        printObject(value, indentLevel + 2);
      } else {
        const formattedValue =
          value !== null && value !== undefined ? value.toString() : 'null';
        let color = log.color.green;

        if (key === 'status') {
          color = value === 'failure' ? log.color.red : log.color.green;
        } else if (key === 'message') {
          color = log.color.yellow;
        }
        log.info(`${formattedKey} ${color(formattedValue)}`);
      }
    });
  }
}
