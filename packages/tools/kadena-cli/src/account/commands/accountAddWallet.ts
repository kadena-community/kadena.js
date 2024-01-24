import { checkbox } from '@inquirer/prompts';
import chalk from 'chalk';
import type { Command } from 'commander';
import debug from 'debug';
import yaml from 'js-yaml';
import path from 'path';

import type { IKeyPair } from '@kadena/types';
import { defaultAccountPath } from '../../constants/account.js';
import { WALLET_DIR } from '../../constants/config.js';
import { printWalletKeys } from '../../keys/utils/keysDisplay.js';
import { services } from '../../services/index.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { sanitizeFilename } from '../../utils/helpers.js';
import { IAddAccountManualConfig } from '../types.js';
import {
  validateAccountDetails,
  writeConfigInFile,
} from '../utils/addHelpers.js';

export const addAccountWalletCommand: (
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
    globalOptions.predicate(),
  ],

  async function addAccount(config): Promise<void> {
    debug('account-add-manual:action')({ config });
    const { keyWalletConfig } = config;
    await printWalletKeys(keyWalletConfig);
    if (!keyWalletConfig) {
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

    publicKeysList.filter((key) => !!key);

    const selectPublicKeys = await checkbox({
      message: 'Select public keys to add to account',
      choices: publicKeysList.map((key) => ({ value: key })),
    });

    (config as unknown as IAddAccountManualConfig).publicKeysConfig =
      selectPublicKeys as string[];

    const sanitizedAlias = sanitizeFilename(config.accountAlias).toLowerCase();
    const filePath = path.join(defaultAccountPath, `${sanitizedAlias}.yaml`);

    const newConfig = await validateAccountDetails(
      config as unknown as IAddAccountManualConfig,
    );

    await writeConfigInFile(filePath, newConfig);
  },
);
