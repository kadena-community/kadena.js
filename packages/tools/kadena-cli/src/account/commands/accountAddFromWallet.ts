import { checkbox } from '@inquirer/prompts';
import type { IKeyPair } from '@kadena/types';
import chalk from 'chalk';
import { Option } from 'commander';
import debug from 'debug';
import yaml from 'js-yaml';
import path from 'path';
import { z } from 'zod';

import { WALLET_DIR } from '../../constants/config.js';
import type { IWallet } from '../../keys/utils/keysHelpers.js';
import { getWallet } from '../../keys/utils/keysHelpers.js';
import { ensureNetworksConfiguration } from '../../networks/utils/networkHelpers.js';
import { services } from '../../services/index.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommandFlexible } from '../../utils/createCommandFlexible.js';
import { createOption } from '../../utils/createOption.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { addAccount } from '../utils/addAccount.js';
import { displayAddAccountSuccess, isEmpty } from '../utils/addHelpers.js';
import { validateAccountDetails } from '../utils/validateAccountDetails.js';

async function getAllPublicKeysFromWallet(
  keyWalletConfig: IWallet,
): Promise<Array<string>> {
  const publicKeysList: Array<string> = [];
  for (const key of keyWalletConfig.keys) {
    const content = await services.filesystem.readFile(
      path.join(WALLET_DIR, keyWalletConfig?.folder, key),
    );
    const parsed = content !== null ? (yaml.load(content) as IKeyPair) : null;
    publicKeysList.push(parsed?.publicKey ?? '');
  }
  return publicKeysList.filter((key) => !isEmpty(key));
}

const selectPublicKeys = createOption({
  key: 'publicKeys' as const,
  defaultIsOptional: false,
  async prompt(prev) {
    const walletDetails = await getWallet(prev.keyWallet as string);
    if (!walletDetails) {
      console.log(chalk.red(`Wallet ${prev.keyWallet} does not exist.`));
      process.exit(1);
    }
    const publicKeysList = await getAllPublicKeysFromWallet(walletDetails);

    return await checkbox({
      message: 'Select public keys to add to account',
      choices: publicKeysList.map((key) => ({ value: key })),
      validate: (input) => {
        if (input.length === 0) {
          return 'Please select at least one public key';
        }

        return true;
      },
    });
  },
  transform(publicKeys: string | string[]) {
    return Array.isArray(publicKeys) ? publicKeys.join(',') : publicKeys;
  },
  expand: async (publicKeys: string | string[]): Promise<string[]> => {
    const keys = Array.isArray(publicKeys) ? publicKeys : publicKeys.split(',');
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
  'Add an account from a wallet to the CLI',
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
    const { publicKeys, publicKeysConfig } = await option.publicKeys();
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
      await validateAccountDetails(config);

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

    debug('account-add-wallet:action')({ config });

    const result = await addAccount(updatedConfig);

    assertCommandError(result);

    displayAddAccountSuccess(config.accountAlias);
  },
);
