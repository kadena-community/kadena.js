import {
  fundAmountValidation,
  getAllAccountNames,
} from '../account/utils/accountHelpers.js';
import { NO_ACCOUNT_ERROR_MESSAGE } from '../constants/account.js';
import type { IPrompt } from '../utils/createOption.js';
import {
  maskStringPreservingStartAndEnd,
  truncateText,
} from '../utils/helpers.js';
import { checkbox, input, select } from '../utils/prompts.js';

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

export const fundAmountPrompt: IPrompt<string> = async () =>
  await input({
    validate(value: string) {
      const parsedValue = parseFloat(value.trim().replace(',', '.'));

      const parseResult = fundAmountValidation.safeParse(parsedValue);
      if (!parseResult.success) {
        const formatted = parseResult.error.format();
        return `Amount: ${formatted._errors[0]}`;
      }
      return true;
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

export const accountSelectionPrompt = async (
  options: string[] = [],
): Promise<string> => {
  const allAccounts = await getAllAccountNames();

  if (allAccounts.length === 0) {
    throw new Error(NO_ACCOUNT_ERROR_MESSAGE);
  }

  const maxAliasLength = Math.max(
    ...allAccounts.map(({ alias }) => alias.length),
  );

  const accountChoices = allAccounts.map(({ alias, name }) => {
    const aliasWithoutExtension = alias.split('.yaml')[0];
    const maxLength = maxAliasLength < 25 ? maxAliasLength : 25;
    const paddedAlias = aliasWithoutExtension.padEnd(maxLength, ' ');
    return {
      value: alias,
      name: `${truncateText(
        paddedAlias,
        25,
      )} - ${maskStringPreservingStartAndEnd(name, 20)}`,
    };
  });

  if (options.includes('all')) {
    accountChoices.unshift({
      value: 'all',
      name: 'All accounts',
    });
  }

  if (options.includes('allowManualInput')) {
    accountChoices.unshift({
      value: 'custom',
      name: 'Enter an account name manually:',
    });
  }

  const selectedAlias = await select({
    message: 'Select an account:(alias - account name)',
    choices: accountChoices,
  });

  if (selectedAlias === 'custom') {
    const accountName = await input({
      message: 'Please enter the account name:',
      validate: function (value: string) {
        if (!value || !value.trim().length) {
          return 'Account name cannot be empty.';
        }

        return true;
      },
    });
    return accountName.trim();
  }

  return selectedAlias;
};

export const accountSelectPrompt: IPrompt<string> = async (
  previousQuestions,
) => {
  const options =
    previousQuestions.isAllowManualInput === true ? ['allowManualInput'] : [];
  return accountSelectionPrompt(options);
};

export const accountSelectAllPrompt: IPrompt<string> = async () => {
  return accountSelectionPrompt(['all']);
};

export const accountSelectMultiplePrompt: IPrompt<string> = async (
  previousQuestions,
  args,
  isOptional,
) => {
  const allAccounts = await getAllAccountNames();
  if (allAccounts.length === 0) {
    throw new Error(NO_ACCOUNT_ERROR_MESSAGE);
  }

  const maxAliasLength = Math.max(
    ...allAccounts.map(({ alias }) => alias.length),
  );

  const allAccountChoices = allAccounts.map(({ alias, name }) => {
    const aliasWithoutExtension = alias.split('.yaml')[0];
    const maxLength = maxAliasLength < 25 ? maxAliasLength : 25;
    const paddedAlias = aliasWithoutExtension.padEnd(maxLength, ' ');
    return {
      value: alias,
      name: `${truncateText(
        paddedAlias,
        25,
      )} - ${maskStringPreservingStartAndEnd(name, 20)}`,
    };
  });

  const selectedAliases = await checkbox({
    message: 'Select an account:(alias - account name)',
    choices: allAccountChoices,
  });

  return selectedAliases.join(',');
};

export const accountDeleteConfirmationPrompt: IPrompt<boolean> = async (
  previousQuestions,
  args,
  isOptional,
) => {
  const selectedAccounts = previousQuestions.accountAlias as string;

  const selectedAccountsLength = selectedAccounts.split(',').length;

  const selectedAccountMessage =
    selectedAccountsLength > 1
      ? 'all the selected aliases accounts'
      : `the ${selectedAccounts} alias account`;

  return await select({
    message: `Are you sure you want to delete ${selectedAccountMessage}?`,
    choices: [
      {
        value: true,
        name: 'Yes',
      },
      {
        value: false,
        name: 'No',
      },
    ],
  });
};
