import { KEYS_ALL_PRED_ERROR_MESSAGE } from '../../constants/account.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { log } from '../../utils/logger.js';
import { accountOptions } from '../accountOptions.js';
import { isValidForOnlyKeysAllPredicate } from '../utils/accountHelpers.js';
import { addAccount } from '../utils/addAccount.js';
import { displayAddAccountSuccess } from '../utils/addHelpers.js';

export const createAddAccountManualCommand = createCommand(
  'add-manual',
  'Add an existing account locally to the CLI',
  [
    accountOptions.accountAlias(),
    accountOptions.accountName({ isOptional: false }),
    accountOptions.fungible(),
    accountOptions.publicKeys({ isOptional: false }),
    accountOptions.predicate(),
  ],

  async (option) => {
    const accountAlias = (await option.accountAlias()).accountAlias;
    const accountName = (await option.accountName()).accountName;
    const fungible = (await option.fungible()).fungible || 'coin';

    let predicate = 'keys-all';
    let isKeysAllPredicate = false;

    const publicKeysPrompt = await option.publicKeys();
    isKeysAllPredicate = isValidForOnlyKeysAllPredicate(
      accountName,
      publicKeysPrompt.publicKeysConfig,
    );

    const allowedPredicates = isKeysAllPredicate ? ['keys-all'] : undefined;
    predicate =
      (
        await option.predicate({
          allowedPredicates,
        })
      ).predicate || 'keys-all';

    const { publicKeys, publicKeysConfig = [] } = publicKeysPrompt ?? {};

    if (isKeysAllPredicate && predicate !== 'keys-all') {
      throw new Error(KEYS_ALL_PRED_ERROR_MESSAGE);
    }

    const validPublicKeys = publicKeysConfig.filter((key) => !!key);

    const aliasConfig = {
      accountAlias,
      accountName,
      fungible,
      predicate,
      publicKeysConfig: validPublicKeys,
    };

    log.debug('create-account-add-manual:action', {
      ...aliasConfig,
      publicKeys,
    });

    const result = await addAccount(aliasConfig);

    assertCommandError(result);

    displayAddAccountSuccess(accountAlias, result.data);
  },
);
