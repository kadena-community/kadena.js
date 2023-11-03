import chalk from 'chalk';
import type { Command } from 'commander';
import debug from 'debug';

export function initCommand(program: Command, version: string): void {
  program
    .command('init')
    .description('Initialize default configuration of the Kadena CLI')
    .action(async () => {
      debug('init:action')({});

      await import('./../networks/init.js');
      console.log(chalk.green('Configured default networks.'));

      console.log(chalk.green('Configuration complete!'));
    });
}
