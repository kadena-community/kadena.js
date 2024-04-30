import { Option } from 'commander';
import { z } from 'zod';

import type { IWallet } from '../../services/wallet/wallet.types.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { createOption } from '../../utils/createOption.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { log } from '../../utils/logger.js';
import { checkbox } from '../../utils/prompts.js';
import { accountOptions } from '../accountOptions.js';
import { addAccount } from '../utils/addAccount.js';
import { displayAddAccountSuccess, isEmpty } from '../utils/addHelpers.js';
import { validateAndRetrieveAccountDetails } from '../utils/validateAndRetrieveAccountDetails.js';

const selectPublicKeys = createOption({
  key: 'publicKeys' as const,
  defaultIsOptional: false,
  async prompt(args) {
    const wallet = args.walletNameConfig as IWallet;
    const publicKeysList = wallet.keys.reduce(
      (acc, key) => acc.concat([key.publicKey]),
      [] as string[],
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
    '-k, --public-keys <publicKeys>',
    'Public keys to add to account',
  ),
});

export const createAddAccountFromWalletCommand = createCommand(
  'add-from-wallet',
  'Add an account from a key wallet',
  [
    globalOptions.walletSelect(),
    accountOptions.accountAlias(),
    accountOptions.fungible(),
    globalOptions.networkSelect(),
    globalOptions.chainId(),
    selectPublicKeys(),
    accountOptions.predicate(),
    accountOptions.accountOverwrite(),
  ],

  async (option, values) => {
    const wallet = await option.walletName();
    const accountAlias = (await option.accountAlias()).accountAlias;
    if (!wallet.walletNameConfig) {
      log.error(`Wallet ${wallet.walletName} does not exist.`);
      return;
    }

    if (wallet.walletNameConfig.keys.length === 0) {
      log.error(
        `Wallet ${wallet.walletName} does not contain any public keys. Please use "kadena wallet generate-keys" command to generate keys.`,
      );
      return;
    }

    const fungible = (await option.fungible()).fungible || 'coin';
    const { network, networkConfig } = await option.network();
    const chainId = (await option.chainId()).chainId;
    const { publicKeys, publicKeysConfig } = await option.publicKeys({
      values,
      walletNameConfig: wallet.walletNameConfig,
    });
    const predicate = (await option.predicate()).predicate || 'keys-all';
    const config = {
      accountAlias,
      wallet,
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

    log.debug('create-account-add-from-wallet:action', updatedConfig);

    const result = await addAccount(updatedConfig);

    assertCommandError(result);

    displayAddAccountSuccess(config.accountAlias, result.data);
  },
);
