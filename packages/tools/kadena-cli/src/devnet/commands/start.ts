import type { Command } from 'commander';
import debug from 'debug';
import { createCommand } from '../../utils/createCommand.js';

export const devnetStartCommand: (program: Command, version: string) => void =
  createCommand('start', 'start the local devnet', [], async (config) => {
    debug('marmalade-mint:action')({ config });
    // startDevnet
  });
