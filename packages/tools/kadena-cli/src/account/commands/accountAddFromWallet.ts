import chalk from 'chalk';
import { Option } from 'commander';
import { z } from 'zod';

import { IS_DEVELOPMENT } from '../../constants/config.js';
import type { IWallet } from '../../keys/utils/keysHelpers.js';
import { ensureNetworksConfiguration } from '../../networks/utils/networkHelpers.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommandFlexible } from '../../utils/createCommandFlexible.js';
import { createOption } from '../../utils/createOption.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { checkbox } from '../../utils/prompts.js';
import { addAccount } from '../utils/addAccount.js';
import {
  displayAddAccountSuccess,
  getAllPublicKeysFromKeyWalletConfig,
  isEmpty,
} from '../utils/addHelpers.js';
import { validateAndRetrieveAccountDetails } from '../utils/validateAndRetrieveAccountDetails.js';

const selectPublicKeys = createOption({
  key: 'publicKeys' as const,
  defaultIsOptional: false,
  async prompt(args) {
    const publicKeysList = await getAllPublicKeysFromKeyWalletConfig(
      args.keyWalletConfig as IWallet,
    );
    const selectedKeys = await checkbox({
      message: 'Select public keys to add to account',
      choices: publicKeysList.map((key) => ({ value: key })),
      validate: (input) => {
        if (input.length === 0) {
          return 'Please select at least one public key';
        }

        return true;
      },
    });
    return selectedKeys.join(',');
  },
  expand: async (publicKeys: string): Promise<string[]> => {
    const keys = publicKeys.split(',');
    return keys
      .map((key: string) => key.trim())
      .filter((key: string) => !isEmpty(key));
  },
  validation: z.string(),
  option: new Option(
    '-p, --public-keys <publicKeys>',
    'Public keys to add to account',
  ),
});

export const createAddAccountFromWalletCommand = createCommandFlexible(
  'add-from-wallet',
  'Add an account from a key wallet',
  [
    globalOptions.accountAlias(),
    globalOptions.keyWalletSelectWithAll(),
    globalOptions.fungible(),
    globalOptions.networkSelect(),
    globalOptions.chainId(),
    selectPublicKeys(),
    globalOptions.predicate(),
    globalOptions.accountOverwrite(),
  ],

  async (option, values) => {
    await ensureNetworksConfiguration();
    const accountAlias = (await option.accountAlias()).accountAlias;
    const keyWallet = await option.keyWallet();
    if (!keyWallet.keyWalletConfig) {
      console.log(chalk.red(`Wallet ${keyWallet.keyWallet} does not exist.`));
      return;
    }

    if (!keyWallet.keyWalletConfig.keys.length) {
      console.log(
        chalk.red(`Wallet ${keyWallet.keyWallet} does not contain any keys.`),
      );
      return;
    }

    const fungible = (await option.fungible()).fungible;
    const { network, networkConfig } = await option.network();
    const chainId = (await option.chainId()).chainId;
    const { publicKeys, publicKeysConfig } = await option.publicKeys({
      values,
      keyWalletConfig: keyWallet.keyWalletConfig,
    });
    const predicate = (await option.predicate()).predicate;
    const config = {
      accountAlias,
      keyWallet,
      fungible,
      network,
      networkConfig,
      chainId,
      predicate,
      publicKeys,
      publicKeysConfig,
      accountOverwrite: false,
    };

    // Account name is not available in the wallet,
    // so we need to create it from the public keys
    // and check if account already exists on chain
    const { accountName, accountDetails, isConfigAreSame } =
      await validateAndRetrieveAccountDetails(config);

    let accountOverwrite = false;
    if (!isConfigAreSame) {
      accountOverwrite = (await option.accountOverwrite()).accountOverwrite;
    }

    const updatedConfig = {
      ...config,
      accountName,
      accountDetailsFromChain: accountDetails,
      accountOverwrite,
    };

    if (IS_DEVELOPMENT) {
      console.log('create-account-add-from-wallet:action', updatedConfig);
    }

    const result = await addAccount(updatedConfig);

    assertCommandError(result);

    displayAddAccountSuccess(config.accountAlias);
  },
);
