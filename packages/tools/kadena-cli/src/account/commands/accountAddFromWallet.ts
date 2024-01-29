import { checkbox } from '@inquirer/prompts';
import type { IKeyPair } from '@kadena/types';
import chalk from 'chalk';
import type { Command } from 'commander';
import { Option } from 'commander';
import debug from 'debug';
import yaml from 'js-yaml';
import path from 'path';
import { z } from 'zod';

import { WALLET_DIR } from '../../constants/config.js';
import type { IWallet } from '../../keys/utils/keysHelpers.js';
import { getWallet } from '../../keys/utils/keysHelpers.js';
import { services } from '../../services/index.js';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { createOption } from '../../utils/createOption.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { addAccount } from '../utils/addAccount.js';
import {
  displayAddAccountSuccess,
  isEmpty,
  overridePromptCb,
} from '../utils/addHelpers.js';

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
  key: 'publicKeys',
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
    });
  },
  transform(publicKeys: string[]) {
    return publicKeys.join(',');
  },
  validation: z.array(z.string()),
  option: new Option(
    '-p, --public-keys <publicKeys>',
    'Public keys to add to account',
  ),
});

export const createAddAccountFromWalletCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'add-from-wallet',
  'Add an account from a wallet to the CLI',
  [
    globalOptions.accountAlias(),
    globalOptions.keyWalletSelectWithAll(),
    globalOptions.fungible(),
    globalOptions.network(),
    globalOptions.chainId(),
    selectPublicKeys(),
    globalOptions.predicate(),
  ],

  async (config): Promise<void> => {
    debug('account-add-wallet:action')({ config });

    const updatedConfig = {
      ...config,
      publicKeysConfig: config.publicKeys.split(','),
    };

    const result = await addAccount(updatedConfig, overridePromptCb);

    assertCommandError(result);

    displayAddAccountSuccess(config.accountAlias);
  },
);
