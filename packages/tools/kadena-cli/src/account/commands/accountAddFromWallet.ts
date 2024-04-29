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
    accountOptions.accountName({ isOptional: false }),
    accountOptions.fungible(),
    selectPublicKeys(),
    accountOptions.predicate(),
  ],

  async (option, values) => {
    const wallet = await option.walletName();
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

    const accountAlias = (await option.accountAlias()).accountAlias;
    const accountName = (await option.accountName()).accountName;

    const fungible = (await option.fungible()).fungible || 'coin';
    const { publicKeys, publicKeysConfig } = await option.publicKeys({
      values,
      walletNameConfig: wallet.walletNameConfig,
    });
    const predicate = (await option.predicate()).predicate || 'keys-all';
    const config = {
      accountAlias,
      wallet,
      fungible,
      predicate,
      publicKeys,
      publicKeysConfig,
    };

    log.debug('create-account-add-from-wallet:action', config);

    const result = await addAccount({
      accountAlias,
      accountName,
      fungible,
      predicate,
      publicKeysConfig,
    });

    assertCommandError(result);

    displayAddAccountSuccess(config.accountAlias, result.data);
  },
);
