import type { Command } from 'commander';
import debug from 'debug';
import { createCommand } from '../../utils/createCommand.js';

// TO-DO: Implement this command
// choices: [
//    > Generate Public key from HD key
//    > Generate Public and Private key from HD key
//    > Generate Public and Private key from newly generated HD key
//   'Exit'
// ],

export const createGenerateFromHdCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'genfromhd',
  'Generate key(s) from HD key',
  [],
  async (config) => {
    debug('generate-from-hid:action')({ config });
    console.log('generate from hd: not implemented yet');
  },
);
