import { Option } from 'commander';
import { z } from 'zod';
import { account } from '../prompts/index.js';
import { createOption } from '../utils/createOption.js';
import type { IAliasAccountData } from './types.js';
import {
  formatZodFieldErrors,
  fundAmountValidation,
  readAccountFromFile,
} from './utils/accountHelpers.js';

export const accountOptions = {
  accountAlias: createOption({
    key: 'accountAlias' as const,
    defaultIsOptional: false,
    prompt: account.accountAliasPrompt,
    validation: z.string(),
    option: new Option(
      '--account-alias <accountAlias>',
      'Enter an alias to store your account',
    ),
  }),
  accountName: createOption({
    key: 'accountName' as const,
    prompt: account.accountNamePrompt,
    validation: z.string(),
    option: new Option('-a, --account-name <accountName>', 'Account name'),
  }),
  accountKdnName: createOption({
    key: 'accountKdnName' as const,
    prompt: account.accountKdnNamePrompt,
    validation: z.string(),
    option: new Option(
      '-a, --account-kdn-name <accountName>',
      'Kadena names name',
    ),
  }),
  accountKdnAddress: createOption({
    key: 'accountKdnAddress' as const,
    prompt: account.accountKdnAddressPrompt,
    validation: z.string(),
    option: new Option(
      '-a, --account-kdn-address <accountKdnAddress>',
      'Kadena names address',
    ),
  }),
  accountOverwrite: createOption({
    key: 'accountOverwrite',
    validation: z.boolean(),
    prompt: account.accountOverWritePrompt,
    option: new Option(
      '-o, --account-overwrite',
      'Overwrite account details from chain',
    ),
  }),
  accountSelect: createOption({
    key: 'account' as const,
    prompt: account.accountSelectPrompt,
    defaultIsOptional: false,
    validation: z.string(),
    option: new Option('-a, --account <account>', 'Select an account'),
    expand: async (accountAlias: string): Promise<IAliasAccountData | null> => {
      try {
        const accountDetails = await readAccountFromFile(accountAlias);
        return accountDetails;
      } catch (error) {
        if (error.message.includes('file not exist') === true) {
          return null;
        }
        throw new Error(error.message);
      }
    },
  }),
  accountSelectWithAll: createOption({
    key: 'accountAlias' as const,
    prompt: account.accountSelectAllPrompt,
    defaultIsOptional: false,
    validation: z.string(),
    option: new Option(
      '-a, --account-alias <account>',
      'Enter your account alias file',
    ),
    expand: async (
      accountAlias: string,
    ): Promise<IAliasAccountData | undefined> => {
      try {
        if (accountAlias === 'all') {
          return;
        }

        const accountDetails = await readAccountFromFile(accountAlias);
        return accountDetails;
      } catch (error) {
        if (error.message.includes('file not exist') === true) {
          return;
        }
        throw new Error(error.message);
      }
    },
  }),
  accountMultiSelect: createOption({
    key: 'accountAlias' as const,
    prompt: account.accountSelectMultiplePrompt,
    defaultIsOptional: false,
    validation: z.string(),
    option: new Option(
      '-a, --account-alias <account>',
      'Enter an alias account(s) separated by a comma',
    ),
  }),
  fundAmount: createOption({
    key: 'amount' as const,
    prompt: account.fundAmountPrompt,
    defaultIsOptional: false,
    validation: z.string({
      /* eslint-disable-next-line @typescript-eslint/naming-convention */
      invalid_type_error: 'Error: -m, --amount must be a positive number',
    }),
    option: new Option('-m, --amount <amount>', 'Amount'),
    transform: (amount: string) => {
      try {
        const parsedAmount = Number(amount);
        fundAmountValidation.parse(parsedAmount);
        return amount;
      } catch (error) {
        const errorMessage = formatZodFieldErrors(error);
        throw new Error(`Error: -m, --amount ${errorMessage}`);
      }
    },
  }),
  accountDeleteConfirmation: createOption({
    key: 'confirm',
    defaultIsOptional: false,
    validation: z.boolean(),
    prompt: account.accountDeleteConfirmationPrompt,
    option: new Option('-c, --confirm', 'Confirm account deletion'),
  }),
};
