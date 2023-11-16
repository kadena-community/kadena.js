import { select } from '@inquirer/prompts';

import { program } from 'commander';

import type { ICustomAccountsChoice } from '../account/accountHelpers.js';

import { getExistingAccounts } from '../utils/helpers.js';
import { keypairPrompt } from './keys.js';

export const gasPayerPrompt = async (): Promise<string> => {
  const existingAccounts: ICustomAccountsChoice[] = await getExistingAccounts();

  if (existingAccounts.length > 0) {
    const selectedKeypair = await select({
      message: 'Select a gas payer account',
      choices: [
        ...existingAccounts,
        { value: undefined, name: 'Create a new account' },
      ],
    });

    if (selectedKeypair !== undefined) {
      return selectedKeypair;
    }
  }

  // At this point there is either no account defined yet,
  // or the user chose to create a new account.
  // Create and select new account.
  await program.parseAsync(['', '', 'account', 'create']);

  return await keypairPrompt();
};
