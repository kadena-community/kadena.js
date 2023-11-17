import type { Command } from 'commander';
import debug from 'debug';
import { createCommand } from '../../utils/createCommand.js';

// TO-DO: Implement this command
// choices: [
//   'List all keys',
//      > HD keys encrypted with password
//         > select and show key
//      > HD keys unencrypted
//         > select and show key
//      > Plain keys
//         > select and show key
//   'Exit'
// ],

export const createListKeysCommand: (
  program: Command,
  version: string,
) => void = createCommand('list', 'List key(s)', [], async (config) => {
  debug('list-keys:action')({ config });
  console.log('list keys: not implemented yet');
});
