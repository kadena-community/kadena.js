import chalk from 'chalk';
import debug from 'debug';
import { ensureNetworksConfiguration } from '../../networks/utils/networkHelpers.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommandFlexible } from '../../utils/createCommandFlexible.js';
import { globalOptions } from '../../utils/globalOptions.js';
import type { Predicate } from '../types.js';
import { addAccount } from '../utils/addAccount.js';
import { displayAddAccountSuccess } from '../utils/addHelpers.js';
import { getAccountDetailsAddManual } from '../utils/getAccountDetails.js';
import { validateAccountDetails } from '../utils/validateAccountDetails.js';

export const createAddAccountManualCommand = createCommandFlexible(
  'add-manual',
  'Add an existing account to the CLI',
  [
    globalOptions.accountAlias(),
    globalOptions.accountName(),
    globalOptions.fungible(),
    globalOptions.networkSelect(),
    globalOptions.chainId(),
    globalOptions.accountOverwrite(),
    globalOptions.publicKeys({ isOptional: false }),
    globalOptions.predicate(),
  ],

  async (option, values) => {
    const accountAlias = (await option.accountAlias()).accountAlias;
    const accountName = (await option.accountName()).accountName;
    const fungible = (await option.fungible()).fungible;

    await ensureNetworksConfiguration();

    const { network, networkConfig } = await option.network();

    const chainId = (await option.chainId()).chainId;

    if (networkConfig === undefined) {
      console.log(
        chalk.red(
          `\nNo network configuration found for "${network}". Please create a "${network}" network.\n`,
        ),
      );
      return;
    }

    const accountDetailsFromChain = accountName
      ? await getAccountDetailsAddManual({
          accountName,
          networkId: networkConfig.networkId,
          chainId,
          networkHost: networkConfig.networkHost,
        })
      : undefined;

    const isEmptyAccountDetails =
      !!accountDetailsFromChain &&
      accountDetailsFromChain.guard.keys.length > 0;

    let accountOverwrite = isEmptyAccountDetails
      ? (await option.accountOverwrite()).accountOverwrite
      : false;

    let publicKeysPrompt = undefined;
    let predicate: Predicate = 'keys-all';

    // If the user choose not to overwrite the account, we need to ask for the public keys and predicate
    if (!accountOverwrite) {
      publicKeysPrompt = await option.publicKeys();
      predicate = (await option.predicate()).predicate;
    }

    const { publicKeys, publicKeysConfig = [] } = publicKeysPrompt ?? {};

    const validatePublicKeys = publicKeysConfig.filter((key) => !!key);

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
      publicKeysConfig: validatePublicKeys,
    };

    let newConfig = { ...config };

    // If the account name is not provided, we need to create account name, get account details from chain and compare config and account details from chain are same
    if (!accountName) {
      const {
        accountName: accountNameFromChain,
        accountDetails,
        isConfigAreSame,
      } = await validateAccountDetails(config);

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

    debug.log('account-add-manual:action', newConfig);

    const result = await addAccount(newConfig);

    assertCommandError(result);

    displayAddAccountSuccess(accountAlias);
  },
);
