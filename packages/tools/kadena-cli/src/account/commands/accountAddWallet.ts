import debug from 'debug';
import type { Command } from 'commander';
import path from 'path';
import chalk from 'chalk';
import yaml from 'js-yaml';
import { checkbox } from '@inquirer/prompts';

import { services } from '../../services/index.js';
import { createCommand } from "../../utils/createCommand.js";
import { globalOptions } from "../../utils/globalOptions.js";
import { defaultAccountPath } from '../../constants/account.js';
import { sanitizeFilename } from '../../utils/helpers.js';
import { printWalletKeys } from '../../keys/utils/keysDisplay.js';
import { WALLET_DIR } from '../../constants/config.js';
import type { IKeyPair } from '@kadena/types';
import { checkAccountDetails, handleExistingAccount } from '../utils/addHelpers.js';

export const addAccountWalletCommand: (program: Command, version: string) => void = createCommand(
  'add-wallet',
  'Add an account from a wallet to the CLI',
  [
    globalOptions.accountAlias(),
    globalOptions.keyWalletSelectWithAll(),
    globalOptions.fungible(),
    globalOptions.network(),
    globalOptions.chainId(),
    globalOptions.predicate(),
  ],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function addAccount(config: any): Promise<void> {
    debug('account-add-manual:action')({ config });
    const { keyWalletConfig } = config;
    await printWalletKeys(keyWalletConfig);
    if(!keyWalletConfig) {
      console.log(chalk.red(`Wallet ${config.keyWallet} does not exist.`));
      return;
    }

    const publicKeysList: Array<string | undefined> = [];
    for (const key of keyWalletConfig.keys) {
      const content = await services.filesystem.readFile(
        path.join(WALLET_DIR, keyWalletConfig?.folder, key),
      );
      const parsed = content !== null ? (yaml.load(content) as IKeyPair) : null;
      publicKeysList.push(parsed?.publicKey);
    }

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    publicKeysList.filter((key) => !!key);

    const selectPublicKeys = await checkbox({
      message: 'Select public keys to add to account',
      choices: publicKeysList.map((key) => ({ value: key })),
    });

    console.log(selectPublicKeys);

    // eslint-disable-next-line require-atomic-updates
    config.publicKeysConfig = selectPublicKeys;

    const sanitizedAlias = sanitizeFilename(config.accountAlias).toLowerCase();
    const filePath = path.join(defaultAccountPath, `${sanitizedAlias}.yaml`);

    const newConfig = await checkAccountDetails(config);

    await handleExistingAccount(filePath, newConfig);

  }
);
