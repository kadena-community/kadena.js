import type { ChainId } from '@kadena/types';
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
    globalOptions.simulateTransferInterval({ isOptional: true }),
    globalOptions.simulateLogFolder({ isOptional: true }),
    globalOptions.simulateTokenPool({ isOptional: true }),
    globalOptions.simulateMaxAmount({ isOptional: true }),
    globalOptions.simulateDefaultChain({ isOptional: true }),
    globalOptions.simulateSeed({ isOptional: true }),
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
      maxAmount: config.maxAmount,
      numberOfAccounts: config.accounts,
      transferInterval: config.interval,
      tokenPool: config.tokenPool,
      logFolder: config.logFolder,
      defaultChain: config.defaultChain as ChainId,
      seed: config.seed,
    });
  },
);
