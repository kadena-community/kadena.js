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
import { IWallet, getWallet } from '../../keys/utils/keysHelpers.js';
import { updateAccountDetailsPrompt } from '../../prompts/account.js';
import { services } from '../../services/index.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { sanitizeFilename } from '../../utils/helpers.js';
import type { IAddAccountManualConfig } from '../types.js';
import { getUpdatedConfig } from '../utils/addHelpers.js';
import { validateAccountDetails } from '../utils/validateAccountDetails.js';
import { writeConfigInFile } from '../utils/writeConfigInFile.js';

async function getAllPublicKeysFromWallet(
  keyWalletConfig: IWallet,
): Promise<Array<string>> {
  const publicKeysList: Array<string> = [];
  for (const key of keyWalletConfig.keys) {
    const content = await services.filesystem.readFile(
      path.join(WALLET_DIR, keyWalletConfig?.folder, key),
    );
    const parsed = content !== null ? (yaml.load(content) as IKeyPair) : null;
    publicKeysList.push(parsed?.publicKey || '');
  }
  return publicKeysList.filter((key) => !!key);
}

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

    const publicKeys = await getAllPublicKeysFromWallet(keyWalletConfig);

    const selectPublicKeys = await checkbox({
      message: 'Select public keys to add to account',
      choices: publicKeys.map((key) => ({ value: key })),
    });

    const updatedConfig = {
      ...config,
      publicKeys: selectPublicKeys.join(','),
      publicKeysConfig: selectPublicKeys,
    };

    const sanitizedAlias = sanitizeFilename(config.accountAlias).toLowerCase();
    const filePath = path.join(defaultAccountPath, `${sanitizedAlias}.yaml`);

    try {
      const {
        config: newConfig,
        accountDetails,
        isConfigAreSame,
      } = await validateAccountDetails(updatedConfig);

      if (isConfigAreSame) {
        await writeConfigInFile(filePath, newConfig);
      } else {
        const updateOption = await updateAccountDetailsPrompt();

        const updatedConfig = getUpdatedConfig(
          newConfig,
          accountDetails,
          updateOption,
        );

        await writeConfigInFile(filePath, updatedConfig);
      }
      console.log(
        chalk.green(
          `\nThe account configuration "${updatedConfig.accountAlias}" has been saved.\n`,
        ),
      );
    } catch (error) {
      if (error.message.includes('row not found')) {
        console.log(
          chalk.red(
            `The account is not on chain yet. To create it on-chain, transfer funds to it from ${updatedConfig.networkConfig.network} and use "fund" command.`,
          ),
        );
        return;
      }
      console.log(chalk.red(`${error.message}`));
      process.exit(1);
    }
  },
);
