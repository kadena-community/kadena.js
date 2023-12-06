import type { Command } from 'commander';
import debug from 'debug';
import { createCommand } from '../../utils/createCommand.js';

// TO-DO: Implement this command
// choices: [
//   'Re-encrypt a key with a new password',
//       '> List of encrypted keys',
//          '> select and re-encrypt with given password',
//   'Exit'
// ],

export const createManageKeysCommand: (
  program: Command,
  version: string,
) => void = createCommand('manage', 'Manage key(s)', [], async (config) => {
  debug('manage-keys:action')({ config });
  console.log('manage keys: not implemented yet');
});
