import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { log } from '../../utils/logger.js';
import { accountOptions } from '../accountOptions.js';
import { isValidForOnlyKeysAllPredicate } from '../utils/accountHelpers.js';
import { addAccount } from '../utils/addAccount.js';
import { displayAddAccountSuccess } from '../utils/addHelpers.js';
import { getAccountDetails } from '../utils/getAccountDetails.js';
import { validateAndRetrieveAccountDetails } from '../utils/validateAndRetrieveAccountDetails.js';

export const createAddAccountManualCommand = createCommand(
  'add-manual',
  'Add an existing account locally to the CLI',
  [
    accountOptions.accountAlias(),
    accountOptions.accountName(),
    accountOptions.fungible(),
    globalOptions.networkSelect(),
    globalOptions.chainId(),
    accountOptions.accountOverwrite(),
    accountOptions.publicKeys(),
    accountOptions.predicate(),
  ],

  async (option) => {
    const accountAlias = (await option.accountAlias()).accountAlias;
    const accountName = (await option.accountName()).accountName;
    const fungible = (await option.fungible()).fungible || 'coin';

    const { network, networkConfig } = await option.network();

    const chainId = (await option.chainId()).chainId;

    const accountDetailsFromChain = accountName
      ? await getAccountDetails({
          accountName,
          networkId: networkConfig.networkId,
          chainId,
          networkHost: networkConfig.networkHost,
          fungible,
        })
      : undefined;

    const hasAccountDetails =
      !!accountDetailsFromChain &&
      accountDetailsFromChain.guard.keys.length > 0;

    let accountOverwrite = hasAccountDetails
      ? (await option.accountOverwrite()).accountOverwrite
      : false;

    let publicKeysPrompt;
    let predicate = 'keys-all';
    let isKeysAllPredicate = false;

    // If the user choose not to overwrite the account, we need to ask for the public keys and predicate
    if (!accountOverwrite) {
      publicKeysPrompt = await option.publicKeys();
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
    }

    const { publicKeys, publicKeysConfig = [] } = publicKeysPrompt ?? {};

    // when --quiet is passed and account details are not in chain
    // public keys are required to add account
    if (!hasAccountDetails && !publicKeysConfig.length) {
      throw new Error(
        'Missing required argument PublicKeys: "-p, --public-keys <publicKeys>"',
      );
    }

    if (isKeysAllPredicate && predicate !== 'keys-all') {
      throw new Error(
        `Predicate should be keys-all for single public key account with "${accountName}"`,
      );
    }

    const validPublicKeys = publicKeysConfig.filter((key) => !!key);

    const config = {
      accountAlias,
      accountDetailsFromChain,
      accountName,
      accountOverwrite,
      chainId,
      fungible,
      network,
      networkConfig,
      predicate,
      publicKeys,
      publicKeysConfig: validPublicKeys,
    };

    let newConfig = { ...config };

    // If the account name is not provided, we need to create account name,
    // get account details from chain and
    // compare config and account details from chain are same
    if (!accountName) {
      const {
        accountName: accountNameFromChain,
        accountDetails,
        isConfigAreSame,
      } = await validateAndRetrieveAccountDetails(config);

      if (!isConfigAreSame) {
        accountOverwrite = (await option.accountOverwrite()).accountOverwrite;
      }

      newConfig = {
        ...newConfig,
        accountName: accountNameFromChain,
        accountDetailsFromChain: accountDetails,
        accountOverwrite,
      };
    }

    log.debug('create-account-add-manual:action', newConfig);

    const result = await addAccount(newConfig);

    assertCommandError(result);

    displayAddAccountSuccess(accountAlias, result.data);
  },
);
