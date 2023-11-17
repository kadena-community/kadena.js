import chalk from 'chalk';
import type { Command } from 'commander';
import debug from 'debug';
import { createCommand } from '../../utils/createCommand.js';

export const createConfigInitCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'init',
  'Initialize default configuration of the Kadena CLI',
  [],
  async (config) => {
    debug('init:action')(config);

    await import('../../networks/init.js');
    console.log(chalk.green('Configured default networks.'));

    console.log(chalk.green('Configuration complete!'));
  },
);
