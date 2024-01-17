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
    globalOptions.simulateNoAccounts({ isOptional: true }),
    globalOptions.simulateTransferInterval(),
    globalOptions.simulateLogFolder(),
    globalOptions.simulateTokenPool(),
    globalOptions.simulateMaxAmount(),
    globalOptions.simulateSeed(),
    globalOptions.simulateMaxTime({ isOptional: true }),
  ],
  async (config) => {
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
      maxTime: config.maxTime,
      maxAmount: config.maxAmount,
      numberOfAccounts: config.accounts,
      transferInterval: config.interval,
      tokenPool: config.tokenPool,
      logFolder: config.logFolder,
      seed: config.seed,
    });
  },
);
