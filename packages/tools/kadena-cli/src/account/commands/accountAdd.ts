import { createCommand } from '../../utils/createCommand.js';
import { options } from '../accountAddOptions.js';
import { addAccountFromKey } from './accountAddFromKey.js';
import { addAccountFromWallet } from './accountAddFromWallet.js';

export const createAddAccountCommand = createCommand(
  'add',
  'Add an existing account locally to the CLI. Use --from=key to select a key file or enter key details manually. Use --from=wallet to select from available wallets.',
  options,
  async (option) => {
    const accountFromSelection = (await option.from()).from;

    if (accountFromSelection === 'key') {
      return addAccountFromKey(option);
    } else if (accountFromSelection === 'wallet') {
      return addAccountFromWallet(option);
    } else {
      throw new Error(
        `Invalid account from value: ${accountFromSelection}. Supported values are "key" and "wallet".`,
      );
    }
  },
);
