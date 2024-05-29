import type { ChainId } from '@kadena/types';
import { KEYS_ALL_PRED_ERROR_MESSAGE } from '../../constants/account.js';
import { networkDefaults } from '../../constants/networks.js';
import { assertCommandError } from '../../utils/command.util.js';
import type { CommandOption } from '../../utils/createCommand.js';
import { isNotEmptyString } from '../../utils/globalHelpers.js';
import { log } from '../../utils/logger.js';
import type { options } from '../accountAddOptions.js';
import type { IAccountDetailsResult, Predicate } from '../types.js';
import { isValidForOnlyKeysAllPredicate } from '../utils/accountHelpers.js';
import { addAccount } from '../utils/addAccount.js';
import { displayAddAccountSuccess } from '../utils/addHelpers.js';
import { createAccountName } from '../utils/createAccountName.js';
import { getAccountDetails } from '../utils/getAccountDetails.js';

export const addAccountFromKey = async (
  option: CommandOption<typeof options>,
): Promise<void> => {
  const accountAlias = (await option.accountAlias()).accountAlias;
  let accountName = (await option.accountName()).accountName;
  const fungible = (await option.fungible()).fungible || 'coin';

  let accountDetailsFromChain: IAccountDetailsResult | undefined;
  if (isNotEmptyString(accountName)) {
    const confirmAccountVerification = (await option.verify()).verify;
    if (confirmAccountVerification === true) {
      const { networkConfig } = await option.network();

      const chainId = (await option.chainId()).chainId;

      accountDetailsFromChain = accountName
        ? await getAccountDetails({
            accountName,
            networkId: networkConfig.networkId,
            chainId,
            networkHost: networkConfig.networkHost,
            fungible,
          })
        : undefined;
    }
  }

  const hasAccountDetails =
    !!accountDetailsFromChain && accountDetailsFromChain.guard.keys.length > 0;

  let publicKeysPrompt;
  let predicate = 'keys-all';
  let isKeysAllPredicate = false;

  // If the user choose not to overwrite the account, we need to ask for the public keys and predicate
  if (!hasAccountDetails) {
    publicKeysPrompt = await option.publicKeys();
    // when --quiet is passed and account details are not in chain
    // public keys are required to add account
    if (!isNotEmptyString(publicKeysPrompt.publicKeys)) {
      throw new Error(
        'Missing required argument PublicKeys: "-k, --public-keys <publicKeys>"',
      );
    }

    isKeysAllPredicate = isNotEmptyString(accountName)
      ? isValidForOnlyKeysAllPredicate(
          accountName,
          publicKeysPrompt.publicKeysConfig,
        )
      : false;
    const allowedPredicates = isKeysAllPredicate ? ['keys-all'] : undefined;
    predicate =
      (
        await option.predicate({
          allowedPredicates,
        })
      ).predicate || 'keys-all';
  }

  const { publicKeys, publicKeysConfig = [] } = publicKeysPrompt ?? {};

  if (isKeysAllPredicate && predicate !== 'keys-all') {
    throw new Error(KEYS_ALL_PRED_ERROR_MESSAGE);
  }

  const config = {
    accountAlias,
    accountName,
    fungible,
    predicate,
    publicKeys,
    publicKeysConfig,
  };

  log.debug('create-account-add-manual:action', config);

  if (!isNotEmptyString(accountName)) {
    // When account name is not passed,
    // so we need to create it from the public keys and predicate to add the account.
    accountName = await createAccountName({
      publicKeys: publicKeysConfig,
      predicate,
      // we're creating a principal account based on the public keys
      // so we're just using the hardcoded chainId and networkConfig
      chainId: '0' as ChainId,
      networkConfig: networkDefaults.testnet,
    });
  }

  const accountGuard = {
    publicKeysConfig: hasAccountDetails
      ? accountDetailsFromChain!.guard.keys
      : publicKeysConfig,
    predicate: hasAccountDetails
      ? (accountDetailsFromChain!.guard.pred as Predicate)
      : predicate,
  };

  const result = await addAccount({
    accountAlias,
    accountName,
    fungible,
    ...accountGuard,
  });

  assertCommandError(result);

  displayAddAccountSuccess(accountAlias, result.data);
};
