import type { IPrompt } from '../utils/createOption.js';
import { input, select } from '../utils/prompts.js';

export const publicKeysPrompt: IPrompt<string> = async (
  previousQuestions,
  args,
  isOptional,
) =>
  await input({
    message: 'Enter one or more public keys (comma separated).',
    validate: function (value: string) {
      if (isOptional && !value) return true;

      if (!value || !value.trim().length) {
        return 'Please enter public keys';
      }

      return true;
    },
  });

export const accountAliasPrompt: IPrompt<string> = async () =>
  await input({
    message: 'Enter an alias for an account.',
    validate: function (value: string) {
      if (!value || value.trim().length < 3) {
        return 'Alias must be minimum at least 3 characters long.';
      }

      return true;
    },
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

export const predicatePrompt: IPrompt<string> = async () => {
  const choices = [
    {
      value: 'keys-all',
      name: 'keys-all',
    },
    {
      value: 'keys-any',
      name: 'keys-any',
    },
    {
      value: 'keys-2',
      name: 'keys-2',
    },
    {
      value: 'custom',
      name: 'Custom predicate',
    },
  ];

  const selectedPredicate = await select({
    message: 'Select a keyset predicate.',
    choices: choices,
  });

  if (selectedPredicate === 'custom') {
    const customPredicate = await input({
      message: 'Enter your own predicate',
      validate: function (value: string) {
        if (!value || !value.trim().length) {
          return 'Predicate cannot be empty.';
        }
        return true;
      },
    });
    return customPredicate.trim();
  }

  return selectedPredicate;
};

export const accountOverWritePrompt: IPrompt<boolean> = async () =>
  await select({
    message: 'Would you like to use the account details on the chain?',
    choices: [
      {
        value: true,
        name: 'Yes, use public keys and predicate from chain',
      },
      {
        value: false,
        name: 'No, use it from user input',
      },
    ],
  });
