import chalk from 'chalk';
import { type Command } from 'commander';
import debug from 'debug';
import { defaultDevnet } from '../constants/devnets.js';
import { processZodErrors } from '../utils/processZodErrors.js';
import { getDevnetConfiguration, removeDevnet as removeDevnetConfiguration } from './devnetsHelpers.js';
import { dockerVolumeName, isDockerInstalled, removeDevnet, removeVolume } from './docker.js';

export function removeDevnetCommand(program: Command, version: string): void {
  program
    .command('remove')
    .description('Remove devnet container and configuration')
    .option('-n, --name <name>', 'Container name (e.g. "devnet")')
    .action(async (args: { name?: string }) => {
      debug('devnet-remove:action')({ args });

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

        const name = args.name || defaultDevnet;
        removeDevnet(name);
        console.log(chalk.green(`Removed devnet container: ${name}`));

        const configuration = getDevnetConfiguration(name);

        if (configuration?.useVolume) {
          removeVolume(name);
          console.log(
            chalk.green(
              `Removed volume: ${dockerVolumeName(name)}`,
            ),
          );
        }

        removeDevnetConfiguration(name);
        console.log(chalk.green(`Successfully removed devnet configuration: ${name}`));
      } catch (e) {
        console.log(chalk.yellow(`Removing devnet did not go as planned: ${e.message}`));
      }
    });
}
