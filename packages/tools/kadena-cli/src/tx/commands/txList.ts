import type { Command } from 'commander';
import { createCommand } from '../../utils/createCommand.js';
import { log } from '../../utils/logger.js';
import { txOptions } from '../txOptions.js';
import { printTx } from '../utils/txDisplayHelper.js';
import { getTransactions } from '../utils/txHelpers.js';

export const createTxListCommand: (program: Command, version: string) => void =
  createCommand(
    'list',
    'List transaction(s)',
    [txOptions.directory({ disableQuestion: true })],
    async (option) => {
      log.debug('list-tx:action');

      const { directory } = await option.directory();
      const transactions: string[] = await getTransactions(
        false,
        directory,
        true,
      );

      transactions.sort((a, b) => {
        const aIsSigned = a.includes('-signed') ? 1 : -1;
        const bIsSigned = b.includes('-signed') ? 1 : -1;
        return bIsSigned - aIsSigned;
      });

      await printTx(transactions);
    },
  );
