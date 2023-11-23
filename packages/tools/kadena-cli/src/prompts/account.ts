import { input, select } from '@inquirer/prompts';
import type { IPrompt } from '../utils/createOption.js';

export const publicKeysPrompt: IPrompt = async () =>
  await input({
    message: 'Enter zero or more public keys (comma separated).',
  });

export const accountNamePrompt: IPrompt = async () =>
  await input({
    message: 'Enter an account name.',
  });

export const amountPrompt: IPrompt = async () =>
  await input({
    validate(value) {
      return !isNaN(parseFloat(value));
    },
    message: 'Enter an amount.',
  });

export const fungiblePrompt: IPrompt = async () =>
  await input({
    default: 'coin',
    message: 'Enter the name of a fungible.',
  });

export const predicatePrompt: IPrompt = async () =>
  await select({
    message: 'Select a keyset predicate.',
    choices: [
      { value: 'keys-all', name: 'keys-all' },
      { value: 'keys-any', name: 'keys-any' },
      { value: 'keys-2', name: 'keys-2' },
    ],
  });
