import { input, select } from '@inquirer/prompts';
import type { IPrompt } from '../utils/createOption.js';

export const predicates = ['keys-all', 'keys-any', 'keys-2'] as const;

export type Predicate = (typeof predicates)[number];

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

export const predicatePrompt: IPrompt<Predicate> = async () =>
  await select({
    message: 'Select a keyset predicate.',
    choices: predicates.map((predicate) => ({
      value: predicate,
      name: predicate,
    })),
  });

export type UpdateAccountType = 'useInput' | 'useFromChain';

const updateAccountDetailsChoices: {
  value: UpdateAccountType;
  name: string;
}[] = [
  {
    value: 'useInput',
    name: 'Add, anyway with user inputs',
  },
  {
    value: 'useFromChain',
    name: 'Add with values from the chain',
  },
];

export const updateAccountDetailsPrompt =
  async (): Promise<UpdateAccountType> =>
    await select({
      message:
        'The account details do not match the account details on the chain. Do you want to continue?',
      choices: updateAccountDetailsChoices,
    });

export const accountOverWritePrompt = async (): Promise<boolean> =>
  await select({
    message: 'Would you like to use the account details on the chain?',
    choices: [
      {
        value: true,
        name: 'Yes, use public keys and predicate from chain',
      },
      {
        value: false,
        name: 'No, prompt for public keys and predicate',
      },
    ],
  });
