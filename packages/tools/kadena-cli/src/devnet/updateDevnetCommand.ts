import chalk from 'chalk';
import { type Command } from 'commander';
import debug from 'debug';
import { processZodErrors } from '../utils/processZodErrors.js';
import { isDockerInstalled, updateDevnet } from './docker.js';

export function updateDevnetCommand(program: Command, version: string): void {
  program
    .command('update')
    .description('Update devnet container image')
    .option(
      '-v, --version <version>',
      'The version of kadena/devnet to update (e.g. "latest")',
    )
    .action(async (args: { version?: string }) => {
      debug('devnet-update:action')({ args });

      try {
        // Abort if Docker is not installed
        if (!isDockerInstalled()) {
          console.log(
            chalk.red(
              'Stopping devnet requires Docker. Please install Docker and try again.',
            ),
          );
          return;
        }

        updateDevnet(args.version || 'latest');
      } catch (e) {
        processZodErrors(program, e, args);
      }
    });
}
