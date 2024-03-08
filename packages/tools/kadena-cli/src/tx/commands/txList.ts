import type { Command } from 'commander';
import { createCommand } from '../../utils/createCommand.js';
import { log } from '../../utils/logger.js';
import { txOptions } from '../txOptions.js';
import { printTx } from '../utils/txDisplayHelper.js';
import { getAllTransactions } from '../utils/txHelpers.js';

export const createTxListCommand: (program: Command, version: string) => void =
  createCommand(
    'list',
    'List transaction(s)',
    [txOptions.directory({ disableQuestion: true })],
    async (option) => {
      log.debug('list-tx:action');

      const { directory } = await option.directory();
      const transactions = await getAllTransactions(directory);

      transactions.sort((a, b) => {
        const aIsSigned = a.signed === true ? 1 : -1;
        const bIsSigned = b.signed === true ? 1 : -1;
        return bIsSigned - aIsSigned;
      });

      await printTx(transactions);
    },
  );
