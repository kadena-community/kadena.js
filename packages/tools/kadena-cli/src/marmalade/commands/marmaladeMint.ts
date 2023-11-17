import type { Command } from 'commander';
import debug from 'debug';
import { createCommand } from '../../utils/createCommand.js';

export const mintCommand: (program: Command, version: string) => void =
  createCommand('mint', 'mint a new NFT on Marmalade', [], async (config) => {
    debug('marmalade-mint:action')({ config });
    // minTNFT
  });
