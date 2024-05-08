import type { ChainId } from '@kadena/types';
import { basename, parse } from 'node:path';
import {
  chainIdRangeValidation,
  fundAmountValidation,
  getAllAccountNames,
  parseChainIdRange,
} from '../account/utils/accountHelpers.js';
import { CHAIN_ID_RANGE_ERROR_MESSAGE } from '../constants/account.js';
import { MAX_CHAIN_VALUE } from '../constants/config.js';
import {
  INVALID_FILE_NAME_ERROR_MSG,
  MULTI_SELECT_INSTRUCTIONS,
} from '../constants/global.js';
import type { IWallet } from '../services/wallet/wallet.types.js';
import type { IPrompt } from '../utils/createOption.js';
import {
  formatZodError,
  isNotEmptyString,
  isValidFilename,
  maskStringPreservingStartAndEnd,
  notEmpty,
  truncateText,
} from '../utils/globalHelpers.js';
import { checkbox, input, select } from '../utils/prompts.js';
import { tableFormatPrompt } from '../utils/tableDisplay.js';

export const publicKeysPrompt: IPrompt<string> = async (
  previousQuestions,
  args,
  isOptional,
) =>
  await input({
    message: 'Enter one or more public keys (comma separated):',
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
    message: 'Enter an alias for an account:',
    validate: async function (value: string) {
      if (!value || value.trim().length < 3) {
        return 'Alias must be minimum at least 3 characters long.';
      }

      if (!isValidFilename(value)) {
        return `Alias is used as a filename. ${INVALID_FILE_NAME_ERROR_MSG}`;
      }

      const allAccountAliases = (await getAllAccountNames()).map((account) =>
        basename(account.alias, '.yaml'),
      );

      if (allAccountAliases.includes(value)) {
        return `Alias "${value}" already exists. Please enter a different alias.`;
      }

      return true;
    },
  });

export const accountNamePrompt: IPrompt<string> = async () =>
  await input({
    message: 'Enter an account name (optional):',
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
    message: 'Enter an amount:',
  });

export const fungiblePrompt: IPrompt<string> = async () =>
  await input({
    default: 'coin',
    message: 'Enter the name of a fungible:',
  });

export const predicatePrompt: IPrompt<string> = async (previousQuestions) => {
  const allowedPredicates =
    previousQuestions.allowedPredicates !== undefined
      ? (previousQuestions.allowedPredicates as string[])
      : [];

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

  const filteredChoices = choices.filter(
    (choice) =>
      allowedPredicates.length === 0 ||
      allowedPredicates.includes(choice.value),
  );

  const selectedPredicate = await select({
    message: 'Select a keyset predicate:',
    choices: filteredChoices,
  });

  if (selectedPredicate === 'custom') {
    const customPredicate = await input({
      message: 'Enter your own predicate:',
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

export const getAllAccountChoices = async (): Promise<
  { value: string; name: string }[]
> => {
  const allAccounts = await getAllAccountNames();

  const maxAliasLength = Math.max(
    ...allAccounts.map(({ alias }) => alias.length),
  );

  return allAccounts.map(({ alias, name }) => {
    const aliasWithoutExtension = parse(alias).name;
    const maxLength = maxAliasLength < 25 ? maxAliasLength : 25;
    const paddedAlias = aliasWithoutExtension.padEnd(maxLength, ' ');
    return {
      value: aliasWithoutExtension,
      name: `${truncateText(
        paddedAlias,
        25,
      )} - ${maskStringPreservingStartAndEnd(name, 20)}`,
    };
  });
};

export const accountSelectionPrompt = async (
  options: string[] = [],
): Promise<string> => {
  const allAccountChoices = await getAllAccountChoices();
  if (options.includes('all')) {
    allAccountChoices.unshift({
      value: 'all',
      name: 'All accounts',
    });
  }

  if (options.includes('allowManualInput')) {
    allAccountChoices.unshift({
      value: 'custom',
      name: 'Enter an account name manually:',
    });
  }

  const selectedAlias = await select({
    message: 'Select an account (alias - account name):',
    choices: allAccountChoices,
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
  return await accountSelectionPrompt(options);
};

export const accountSelectAllPrompt: IPrompt<string> = async (
  previousQuestions,
) => {
  return await accountSelectionPrompt(['all']);
};

export const accountSelectMultiplePrompt: IPrompt<string> = async (
  previousQuestions,
  args,
  isOptional,
) => {
  const allAccountChoices = await getAllAccountChoices();
  const selectedAliases = await checkbox({
    message: 'Select an account (alias - account name):',
    choices: allAccountChoices,
    instructions: MULTI_SELECT_INSTRUCTIONS,
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
    previousQuestions.accountAlias === 'all'
      ? 'all the accounts'
      : selectedAccountsLength > 1
        ? 'all the selected aliases accounts'
        : `the ${selectedAccounts} alias account`;

  const answer = await input({
    message: `Are you sure you want to delete ${selectedAccountMessage}? '\n  type "yes" to confirm or "no" to cancel and press enter. \n`,
    validate: (input) => {
      if (input === 'yes' || input === 'no') {
        return true;
      }
      return 'Please type "yes" to confirm or "no" to cancel.';
    },
  });
  return answer === 'yes';
};

export const chainIdPrompt: IPrompt<string> = async (
  previousQuestions,
  args,
  isOptional,
) => {
  const defaultValue = (args.defaultValue as string) || '0';
  return (await input({
    message: `Enter a ChainId (0-${MAX_CHAIN_VALUE}) (comma or hyphen separated e.g 0,1,2 or 1-5 or all):`,
    default: defaultValue,
    validate: function (input) {
      if (input.trim() === 'all') return true;

      const parseInput = parseChainIdRange(input);

      if (!parseInput || !parseInput.length) {
        return CHAIN_ID_RANGE_ERROR_MESSAGE;
      }

      const result = chainIdRangeValidation.safeParse(parseInput);
      if (!result.success) {
        const formatted = formatZodError(result.error);
        return `ChainId: ${formatted}`;
      }
      return true;
    },
  })) as ChainId;
};

export const publicKeysForAccountAddPrompt: IPrompt<string> = async (
  previousQuestions,
  args,
  isOptional,
) => {
  if (previousQuestions.type === 'manual') {
    return publicKeysPrompt(previousQuestions, args, isOptional);
  }

  if (!notEmpty(previousQuestions.walletNameConfig)) {
    throw new Error('Wallet config is not provided');
  }

  const wallet = previousQuestions.walletNameConfig as IWallet;
  const keysList = [wallet].flatMap((wallet) => wallet.keys.map((key) => key));
  const selectedKeys = await checkbox({
    message: 'Select public keys to add to account(index - alias - publickey):',
    choices: tableFormatPrompt([
      ...keysList.map((key) => {
        const { index, alias, publicKey } = key;
        return {
          value: publicKey,
          name: [
            index.toString(),
            isNotEmptyString(alias) ? truncateText(alias, 24) : '',
            maskStringPreservingStartAndEnd(publicKey, 24),
          ],
        };
      }),
    ]),
    pageSize: 10,
    instructions: MULTI_SELECT_INSTRUCTIONS,
    validate: (input) => {
      if (input.length === 0) {
        return 'Please select at least one public key';
      }

      return true;
    },
  });
  return selectedKeys.join(',');
};

export const accountTypeSelectionPrompt: IPrompt<string> = async () => {
  return await select({
    message: `How would you like to add the account locally?`,
    choices: [
      {
        value: 'manual',
        name: 'Manually - Enter public keys and account details manually',
      },
      {
        value: 'wallet',
        name: 'From Wallet - Select public keys from a wallet',
      },
    ],
  });
};
