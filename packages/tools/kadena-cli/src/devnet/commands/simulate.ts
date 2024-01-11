import debug from 'debug';
import {
  CreateCommandReturnType,
  createCommand,
} from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';

export const simulateCommand: CreateCommandReturnType = createCommand(
  'simulate',
  'Simulate traffic on a devnet',
  [globalOptions.devnet()],
  async (config) => {
    debug('devnet-simulate:action')({ config });

    console.log('CONFIG', config);

    console.log('Here is where we will simulate traffic on a devnet');
  },
);
