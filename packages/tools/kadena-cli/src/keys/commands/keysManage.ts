import type { Command } from 'commander';
import debug from 'debug';
import { createCommand } from '../../utils/createCommand.js';

// TO-DO: Implement this command
// choices: [
//   'Encrypt an unencrypted HD key',
//       '> List of unencrypted HD keys',
//          '> select and encrypt an unencrypted HD key',
//   'Re-encrypt a key with a new password',
//       '> List of encrypted HD keys',
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
