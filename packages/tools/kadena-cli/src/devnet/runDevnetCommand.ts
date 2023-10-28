import { defaultDevnet } from '../constants/devnets.js';
import { getExistingDevnets } from '../utils/helpers.js';

import type { TDevnetsCreateOptions } from './devnetsCreateQuestions.js';
import { loadDevnet } from './devnetsHelpers.js';

import chalk from 'chalk';
import { Option, type Command } from 'commander';
import debug from 'debug';
import { processZodErrors } from '../utils/processZodErrors.js';
import { runDevnetsCreate } from './createDevnetsCommand.js';
import { isDockerInstalled, runDevnet } from './docker.js';

export function runDevnetCommand(program: Command, version: string): void {
  program
    .command('run')
    .description('Run devnet')
    .option('-n, --name <name>', 'Container name (e.g. "devnet")')
    .addOption(
      new Option(
        '-p, --port <port>',
        'Port to forward to the Chainweb node API (e.g. 8080)',
      ).argParser((value) => parseInt(value, 10)),
    )
    .option(
      '-u, --useVolume',
      'Create a persistent volume to mount to the container',
    )
    .option(
      '-m, --mountPactFolder <mountPactFolder>',
      'Mount a folder containing Pact files to the container (e.g. "./pact")',
    )
    .option(
      '-v, --version <version>',
      'Version of the kadena/devnet Docker image to use (e.g. "latest")',
    )
    .action(async (args: TDevnetsCreateOptions) => {
      debug('devnet-run:action')({ args });

      try {
        // Abort if Docker is not installed
        if (!isDockerInstalled()) {
          console.log(
            chalk.red(
              'Running devnet requires Docker. Please install Docker and try again.',
            ),
          );
          return;
        }

        /**
         * `kadena devnet run` # run default devnet configuration
         * `kadena devnet run --name exists` # run custom devnet configuration
         * `kadena devnet run --name does-not-exist` # create new devnet configuration to run
         */
        const name = args.name || defaultDevnet;
        const existingDevnets = getExistingDevnets();
        if (!existingDevnets.map((d) => d.name).find((n) => n === name)) {
          await runDevnetsCreate(program, version, args);
        }
        const devnetConfig = loadDevnet(name);

        // This should never be true, but just in case.
        if (devnetConfig === null) {
          console.log(
            chalk.red(
              `Missing devnet configuration: ${name}. Cannot run devnet.`,
            ),
          );
          return;
        }

        runDevnet(devnetConfig);
      } catch (e) {
        processZodErrors(program, e, args);
      }
    });
}
