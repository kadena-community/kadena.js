import type { ChainId } from '@kadena/types';
import { Option } from 'commander';
import { z } from 'zod';
import { account } from '../prompts/index.js';
import { createOption } from '../utils/createOption.js';
import { generateAllChainIds } from '../utils/helpers.js';
import { log } from '../utils/logger.js';
import type { IAliasAccountData } from './types.js';
import {
  chainIdRangeValidation,
  formatZodErrors,
  formatZodFieldErrors,
  fundAmountValidation,
  parseChainIdRange,
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
        log.debug(`Error in accountSelect expand`, error);
        return null;
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
  publicKeys: createOption({
    key: 'publicKeys' as const,
    prompt: account.publicKeysPrompt,
    validation: z.string(),
    option: new Option(
      '-k, --public-keys <publicKeys>',
      'Public keys (comma separated)',
    ),
    expand: async (publicKeys: string) => {
      return publicKeys
        ?.split(',')
        .map((value) => value.trim())
        .filter((key) => !!key);
    },
  }),
  fungible: createOption({
    key: 'fungible' as const,
    prompt: account.fungiblePrompt,
    validation: z.string(),
    option: new Option('-f, --fungible <fungible>', 'Fungible'),
  }),
  predicate: createOption({
    key: 'predicate' as const,
    prompt: account.predicatePrompt,
    validation: z.string(),
    option: new Option('-p, --predicate <predicate>', 'Keyset predicate'),
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
  chainIdRange: createOption({
    key: 'chainId' as const,
    prompt: account.chainIdPrompt,
    defaultIsOptional: false,
    validation: z.string({
      /* eslint-disable-next-line @typescript-eslint/naming-convention */
      invalid_type_error: 'Error: -c, --chain-id must be a number',
    }),
    option: new Option('-c, --chain-id <chainId>'),
    transform: (chainId: string) => {
      if (chainId === 'all') {
        return generateAllChainIds();
      }

      const chainIds = parseChainIdRange(chainId.trim());
      const parse = chainIdRangeValidation.safeParse(chainIds);
      if (!parse.success) {
        const formatted = formatZodErrors(parse.error);
        throw new Error(`ChainId: ${formatted}`);
      }

      return parse.data.map((id) => id.toString()) as ChainId[];
    },
  }),
};
