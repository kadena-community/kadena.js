import debug from 'debug';
import {
  CreateCommandReturnType,
  createCommand,
} from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { simulateCoin } from '../utils/simulation/coin/simulate.js';

export const simulateCommand: CreateCommandReturnType = createCommand(
  'simulate',
  'Simulate traffic on a devnet',
  [
    globalOptions.simulateNoAccounts(),
    globalOptions.simulateTransferInterval(),
    globalOptions.simulateMaxAmount(),
    globalOptions.simulateTokenPool(),
    globalOptions.simulateSeed(),
  ],
  async (config) => {
    debug('devnet-simulate:action')({ config });

    console.log('CONFIG', config);

    await simulateCoin({
      maxAmount: config.simulateMaxAmount,
      numberOfAccounts: config.simulateAccountAmount,
      transferInterval: config.simulateTransferInterval,
      tokenPool: config.simulateTokenPool,
      seed: config.simulateSeed,
    });
  },
);
