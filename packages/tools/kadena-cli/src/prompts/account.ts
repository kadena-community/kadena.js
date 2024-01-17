import { input, select } from '@inquirer/prompts';
import type { IPrompt } from '../utils/createOption.js';

export const publicKeysPrompt: IPrompt<string> = async () =>
  await input({
    message: 'Enter zero or more public keys (comma separated):',
  });

export const accountAliasPrompt: IPrompt<string> = async () =>
  await input({
    message: 'Enter an alias for an account.',
    validate: function(value: string) {
      if(!value || value.trim().length <= 3) {
        return 'Alias must be minimum at least 3 characters long.';
      }

      return true;
    }
  });

export const accountNamePrompt: IPrompt<string> = async () =>
  await input({
    message: 'Enter an account name:',
  });

export const accountKdnAddressPrompt: IPrompt<string> = async () =>
  await input({
    message: 'Enter an k:account:',
  });

export const accountKdnNamePrompt: IPrompt<string> = async () =>
  await input({
    message: 'Enter an .kda name:',
  });

export const amountPrompt: IPrompt<string> = async () =>
  await input({
    validate(value: string) {
      return !isNaN(parseFloat(value.replace(',', '.')));
    },
    message: 'Enter an amount.',
  });

export const fungiblePrompt: IPrompt<string> = async () =>
  await input({
    default: 'coin',
    message: 'Enter the name of a fungible:',
  });

export const predicatePrompt: IPrompt<string> = async () =>
  await select({
    message: 'Select a keyset predicate.',
    choices: [
      { value: 'keys-all', name: 'keys-all' },
      { value: 'keys-any', name: 'keys-any' },
      { value: 'keys-2', name: 'keys-2' },
    ],
  });
