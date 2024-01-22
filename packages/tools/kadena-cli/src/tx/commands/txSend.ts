import type { Command } from 'commander';

export interface ISendOptions {}

import debug from 'debug';
import { createCommand } from '../../utils/createCommand.js';

export const sendCommand: (program: Command, version: string) => void =
  createCommand(
    'send',
    'send a transaction to the blockchain',
    [],
    async (config) => {
      debug('tx-send:action')({ config });
      // send TX
    },
  );
