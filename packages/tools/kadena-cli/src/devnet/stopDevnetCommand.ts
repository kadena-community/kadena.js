import chalk from 'chalk';
import { type Command } from 'commander';
import debug from 'debug';
import { defaultDevnet } from '../constants/devnets.js';
import { processZodErrors } from '../utils/processZodErrors.js';
import { isDockerInstalled, stopDevnet } from './docker.js';

export function stopDevnetCommand(program: Command, version: string): void {
  program
    .command('stop')
    .description('Stop devnet')
    .option('-n, --name <name>', 'Container name (e.g. "devnet")')
    .action(async (args: { name?: string }) => {
      debug('devnet-stop:action')({ args });

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

        stopDevnet(args.name || defaultDevnet);
      } catch (e) {
        processZodErrors(program, e, args);
      }
    });
}
