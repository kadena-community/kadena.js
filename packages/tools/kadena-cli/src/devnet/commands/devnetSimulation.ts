import type { ChainId } from '@kadena/types';
import chalk from 'chalk';
import debug from 'debug';
import type { CreateCommandReturnType } from '../../utils/createCommand.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { containerIsRunning, guardDocker } from '../utils/docker.js';
import { simulateCoin } from '../utils/simulation/coin/simulate.js';

export const simulateCommand: CreateCommandReturnType = createCommand(
  'simulate',
  'Simulate traffic on a devnet',
  [
    globalOptions.devnet(),
    globalOptions.numberOfAccounts({ isOptional: true }),
    globalOptions.transferInterval({ isOptional: true }),
    globalOptions.logFolder({ isOptional: true }),
    globalOptions.tokenPool({ isOptional: true }),
    globalOptions.maxTransferAmount({ isOptional: true }),
    globalOptions.defaultChainId({ isOptional: true }),
    globalOptions.seed({ isOptional: true }),
  ],
  async (config) => {
    try {
      debug('devnet-simulate:action')({ config });

      guardDocker();

      if (!containerIsRunning(config.devnetConfig.name)) {
        console.log('Devnet is not running. Please run the devnet first.');
        return;
      }

      await simulateCoin({
        network: {
          id: 'fast-development',
          host: `http://localhost:${config.devnetConfig.port}`,
        },
        maxAmount: config.maxTransferAmount,
        numberOfAccounts: config.accounts,
        transferInterval: config.interval,
        tokenPool: config.tokenPool,
        logFolder: config.logFolder,
        defaultChain: config.defaultChainId,
        seed: config.seed,
      });
    } catch (error) {
      console.log(chalk.red(`\n${error.message}\n`));
      process.exit(1);
    }
  },
);
