import chalk from 'chalk';
import type { Command } from 'commander';
import debug from 'debug';

import type { CommandResult } from '../../utils/command.util.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';

// import { globalOptions } from '../../utils/globalOptions.js';

/*

kadena tx send ??
*/

export const sendTransactionAction = async (
  something: string,
): Promise<CommandResult<{}>> => {
  return { success: true, data: {} };
};

export const createSendTransactionCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'send',
  'send a transaction to the network',
  [],
  async (config) => {
    try {
      debug('send-transaction:action')({ config });

      const result = await sendTransactionAction('something');
      assertCommandError(result);

      console.log(chalk.green(`\nSome Logging.\n`));
    } catch (error) {
      console.error(chalk.red(`\nAn error occurred: ${error.message}\n`));
      process.exit(1);
    }
  },
);
