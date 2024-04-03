import ora from 'ora';
import { KEYS_ALL_PRED_ERROR_MESSAGE } from '../../constants/account.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { log } from '../../utils/logger.js';
import { accountOptions } from '../accountOptions.js';
import type { Predicate } from '../types.js';
import { isValidForOnlyKeysAllPredicate } from '../utils/accountHelpers.js';
import { createAccountOnMainnet } from '../utils/createAccountOnMainnet.js';

export const createAccountCreateCommand = createCommand(
  'create',
  'Create an account on mainnet',
  [
    accountOptions.accountName({ isOptional: true }),
    accountOptions.publicKeys({ isOptional: false }),
    accountOptions.predicate({ isOptional: false }),
    globalOptions.chainId({ isOptional: false }),
    accountOptions.fungible({
      isOptional: true,
      disableQuestion: true,
    }),
  ],
  async (option) => {
    const { accountName } = await option.accountName();
    const { publicKeysConfig } = await option.publicKeys();
    const isOnlyKeysAllPredicate = isValidForOnlyKeysAllPredicate(
      accountName,
      publicKeysConfig,
    );
    const allowedPredicates = isOnlyKeysAllPredicate ? ['keys-all'] : undefined;

    const { predicate } = (await option.predicate({
      allowedPredicates,
    })) as {
      predicate: Predicate;
    };

    const { chainId } = await option.chainId();
    const fungible = (await option.fungible()).fungible || 'coin';

    if (isOnlyKeysAllPredicate && predicate !== 'keys-all') {
      throw new Error(KEYS_ALL_PRED_ERROR_MESSAGE);
    }

    const config = {
      accountName,
      publicKeys: publicKeysConfig,
      predicate,
      chainId,
      fungible,
    };

    log.debug('account-create:action', config);

    const loader = ora('Creating account...\n').start();
    const result = await createAccountOnMainnet(config);

    assertCommandError(result, loader);
    log.info(log.color.green(`Account "${result.data}" created successfully`));
  },
);
