import type { ChainId } from '@kadena/types';
import { Option } from 'commander';
import { z } from 'zod';
import { CHAIN_ID_RANGE_ERROR_MESSAGE } from '../../constants/account.js';
import { actionAskForDeployFaucet } from '../../prompts/genericActionPrompts.js';
import { account } from '../../prompts/index.js';
import { services } from '../../services/index.js';
import { createOption } from '../../utils/createOption.js';
import {
  formatZodError,
  generateAllChainIds,
} from '../../utils/globalHelpers.js';
import { isEmpty } from '../../utils/helpers.js';
import { log } from '../../utils/logger.js';
import type { IAliasAccountData } from './types.js';
import {
  chainIdRangeValidation,
  createFundAmountValidation,
  formatZodFieldErrors,
  isValidMaxAccountFundParams,
  parseChainIdRange,
} from './utils/accountHelpers.js';

export const accountOptions = {
  accountFromSelection: createOption({
    key: 'from' as const,
    defaultIsOptional: false,
    prompt: account.accountFromSelectionPrompt,
    validation: z.string(),
    option: new Option(
      '-f, --from <from>',
      'Specify the method to add account details: "key or wallet".',
    ),
  }),
  accountAlias: createOption({
    key: 'accountAlias' as const,
    defaultIsOptional: false,
    prompt: account.accountAliasPrompt,
    validation: z.string(),
    option: new Option(
      '-l, --account-alias <accountAlias>',
      'Alias to store your account details',
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
      'Confirm overwrite account details from chain',
    ),
  }),
  accountSelect: createOption({
    key: 'account' as const,
    prompt: account.accountSelectPrompt,
    defaultIsOptional: false,
    validation: z.string(),
    option: new Option('-a, --account <account>', 'Account alias name'),
    expand: async (accountAlias: string): Promise<IAliasAccountData | null> => {
      try {
        const accountDetails = await services.account.getByAlias(accountAlias);
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
    option: new Option('-a, --account-alias <account>', 'Account alias name'),
  }),
  accountMultiSelect: createOption({
    key: 'accountAlias' as const,
    prompt: account.accountSelectMultiplePrompt,
    defaultIsOptional: false,
    validation: z.string(),
    option: new Option(
      '-a, --account-alias <account>',
      'Alias account(s) (comma separated for multiple accounts)',
    ),
  }),
  publicKeys: createOption({
    key: 'publicKeys' as const,
    prompt: account.publicKeysPrompt,
    validation: z.string(),
    option: new Option(
      '-k, --public-keys <publicKeys>',
      'Public keys (comma separated for multiple keys)',
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
    option: new Option(
      '-f, --fungible <fungible>',
      'Fungible module name (default: coin)',
    ),
  }),
  predicate: createOption({
    key: 'predicate' as const,
    prompt: account.predicatePrompt,
    validation: z.string(),
    option: new Option(
      '-p, --predicate <predicate>',
      'Account keyset predicate',
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
    option: new Option('-m, --amount <amount>', 'Amount to fund your account'),
    transform: (amount: string, ...rest) => {
      if (
        !(
          Array.isArray(rest) &&
          rest.length > 0 &&
          isValidMaxAccountFundParams(rest[0])
        )
      ) {
        throw new Error(
          'Invalid rest parameters. Ensure that maxAmount and numberOfChains are provided and are numbers',
        );
      }

      const maxAmount = rest[0].maxAmount;
      const numberOfChains = rest[0].numberOfChains;

      try {
        const parsedAmount = Number(amount);
        createFundAmountValidation(numberOfChains, maxAmount).parse(
          parsedAmount,
        );
        return amount;
      } catch (error) {
        const errorMessage = formatZodFieldErrors(error);
        throw new Error(`Error: -m, --amount "${errorMessage}"`);
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
    key: 'chainIds' as const,
    prompt: account.chainIdPrompt,
    defaultIsOptional: false,
    validation: z.string({
      /* eslint-disable-next-line @typescript-eslint/naming-convention */
      invalid_type_error: 'Error: -c, --chain-id must be a number',
    }),
    option: new Option(
      '-c, --chain-ids <chainIds>',
      'Kadena chain id range (e.g: 1 / 0-3 / 0,1,5 / all)',
    ),
    transform: (chainId: string) => {
      if (chainId === 'all') {
        return generateAllChainIds();
      }

      const chainIds = parseChainIdRange(chainId.trim());
      if (!chainIds || !chainIds.length) {
        log.error(CHAIN_ID_RANGE_ERROR_MESSAGE);
        return;
      }

      const parse = chainIdRangeValidation.safeParse(chainIds);
      if (!parse.success) {
        const formatted = formatZodError(parse.error);
        log.error(`Error: -c, --chain-id in ${formatted}`);
        return;
      }

      return parse.data.map((id) => id.toString()) as ChainId[];
    },
  }),
  deployFaucet: createOption({
    key: 'deployFaucet',
    validation: z.boolean(),
    prompt: actionAskForDeployFaucet,
    option: new Option(
      '-d, --deploy-faucet',
      'Deploy faucet on devnet if not available on chain.',
    ),
  }),
  selectPublicKeys: createOption({
    key: 'publicKeys' as const,
    defaultIsOptional: false,
    prompt: account.publicKeysForAccountAddPrompt,
    expand: async (publicKeys: string): Promise<string[]> => {
      const keys = publicKeys?.split(',');
      return keys
        ?.map((key: string) => key.trim())
        .filter((key: string) => !isEmpty(key));
    },
    validation: z.string(),
    option: new Option(
      '-k, --public-keys <publicKeys>',
      'Public keys to add to account',
    ),
  }),
  confirmAccountVerification: createOption({
    key: 'verify' as const,
    validation: z.boolean(),
    prompt: account.confirmAccountVerificationPrompt,
    option: new Option('-v, --verify', 'Verify account details on chain'),
  }),
};
