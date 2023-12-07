import type { Command } from 'commander';
import debug from 'debug';
import { createCommand } from '../../utils/createCommand.js';

// TO-DO: Implement this command
// choices: [
//   'Encrypt an unencryptedSeed',
//       '> List of unencryptedSeeds',
//          '> select and encrypt an unencryptedSeed',
//   'Re-encrypt a key with a new password',
//       '> List of encryptedSeeds',
//          '> select and encrypt with given password',
//   'Delete a key',
//       '> List of all keys',
//          '> select and delete a key',
//   'Exit'
// ],

export const createManageKeysCommand: (
  program: Command,
  version: string,
) => void = createCommand('manage', 'Manage key(s)', [], async (config) => {
  debug('manage-keys:action')({ config });
  console.log('manage keys: not implemented yet');
});
