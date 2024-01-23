import { input, select } from '@inquirer/prompts';
import type { IPrompt } from '../utils/createOption.js';

export const publicKeysPrompt: IPrompt<string> = async () =>
  await input({
    message: 'Enter zero or more public keys (comma separated).',
  });

export const accountNamePrompt: IPrompt<string> = async () =>
  await input({
    message: 'Enter an account name.',
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
    message: 'Enter the name of a fungible.',
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
