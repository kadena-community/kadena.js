import { select } from '@inquirer/prompts';
import chalk from 'chalk';
import type { Command } from 'commander';
import debug from 'debug';
import path from 'path';
import { defaultAccountPath } from '../../constants/account.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { sanitizeFilename } from '../../utils/helpers.js';
import type {
  IAccountDetailsResult,
  IAddAccountManualConfig,
} from '../types.js';
import { validateAccountDetails } from '../utils/validateAccountDetails.js';
import { writeConfigInFile } from '../utils/writeConfigInFile.js';

export const getUpdatedConfig = (
  config: IAddAccountManualConfig,
  accountDetails: IAccountDetailsResult,
  updateOption: string,
) => {
  if (updateOption === 'userInput') {
    return config;
  } else {
    const updatedConfig = {
      ...config,
      publicKeys: accountDetails.publicKeys.join(','),
      publicKeysConfig: accountDetails.publicKeys,
      predicate: accountDetails.predicate,
    };
    return updatedConfig;
  }
};

export const addAccountManualCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'add-manual',
  'Add an existing account to the CLI',
  [
    globalOptions.accountAlias(),
    globalOptions.accountName(),
    globalOptions.fungible(),
    globalOptions.network(),
    globalOptions.chainId(),
    globalOptions.publicKeys(),
    globalOptions.predicate(),
  ],

  async function addAccount(config): Promise<void> {
    debug('account-add-manual:action')({ config });

    const sanitizedAlias = sanitizeFilename(config.accountAlias);
    const filePath = path.join(defaultAccountPath, `${sanitizedAlias}.yaml`);

    try {
      const [{ config: newConfig, accountDetails }, isConfigAreSame] =
        await validateAccountDetails(config);

      if (isConfigAreSame) {
        await writeConfigInFile(filePath, newConfig);
      } else {
        const updateOption = await select({
          message:
            'The account details do not match the account details on the chain. Do you want to continue?',
          choices: [
            { value: 'userInput', name: 'Add, anyway with user inputs' },
            { value: 'chain', name: 'Add with values from the chain' },
          ],
        });

        const updatedConfig = getUpdatedConfig(
          newConfig,
          accountDetails,
          updateOption,
        );

        await writeConfigInFile(filePath, updatedConfig);
      }
      console.log(
        chalk.green(
          `\nThe account configuration "${config.accountAlias}" has been saved.\n`,
        ),
      );
    } catch (error) {
      if (error.message.includes('row not found')) {
        console.log(
          chalk.red(
            `The account ${config.accountName} is not on chain yet. To create it on-chain, transfer funds to it from ${config.networkConfig.network} and use "fund" command.`,
          ),
        );
        return;
      }
      console.log(chalk.red(`${error.message}`));
      process.exit(1);
    }
  },
);
