import { createCommand } from '../../utils/createCommand.js';
import { options } from '../accountAddOptions.js';
import { addAccountFromWallet } from './accountAddFromWallet.js';
import { addAccountManual } from './accountAddManual.js';

export const createAddAccountCommand = createCommand(
  'add',
  'Add an existing account locally to the CLI',
  options,
  async (option) => {
    const typeSelection = (await option.type()).type;

    if (typeSelection === 'manual') {
      return addAccountManual(option);
    } else if (typeSelection === 'wallet') {
      return addAccountFromWallet(option);
    } else {
      throw new Error(
        `Invalid account type : ${typeSelection}. Supported types are 'manual' and 'wallet'`,
      );
    }
  },
);
