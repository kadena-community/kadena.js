import debug from 'debug';
import type { Command } from 'commander';
import path from 'path';
import chalk from 'chalk';
import yaml from 'js-yaml';
import { details } from '@kadena/client-utils/coin';
import { select } from '@inquirer/prompts';

import { services } from '../../services/index.js';
import { createCommand } from "../../utils/createCommand.js";
import { globalOptions } from "../../utils/globalOptions.js";
import { defaultAccountPath } from '../../constants/account.js';
import { sanitizeFilename } from '../../utils/helpers.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function writeAlias(config: any, filePath: string): Promise<void> {
  await services.filesystem.ensureDirectoryExists(filePath);
  await services.filesystem.writeFile(
    filePath,
    yaml.dump(config),
  );
}

export const addAccountCommand: (program: Command, version: string) => void = createCommand(
  'add',
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
  async (config) => {
    debug('account-add:action')({ config });
    const sanitizedAlias = sanitizeFilename(config.accountAlias).toLowerCase();
    const filePath = path.join(defaultAccountPath, `${sanitizedAlias}.yaml`);

    // When user inputs the account name
    // we need to fetch the account details from the chain
    if(config.accountName) {
      const accountDetails = await details(
        config.accountName,
        config.networkConfig.networkId,
        config.chainId,
        config.networkConfig.networkHost,
      );
      const { guard: { keys = [], pred: storedPred } = {} } = accountDetails as { guard: { keys: string[], pred: string } } ;

      const publicKeys = config.publicKeysConfig
        .filter((key) => !!key);

      const isSameKeys = publicKeys.length === 0
        ? true
        : keys.every((key) => config.publicKeys.includes(key));

      if (!isSameKeys || config.predicate !== storedPred) {
        const updateOption =  await select({
          message: 'The account details do not match the account details on the chain. Do you want to continue?',
          choices: [
            { value: 'userInput', name: 'Add, anyway with user inputs' },
            { value: 'chain', name: 'Add with values from the chain' },
          ],
        });

        console.log({ updateOption });
      }
    }

    if(await services.filesystem.fileExists(filePath)) {
      console.log(
        chalk.yellow(
          `\nThe existing account configuration "${config.accountAlias}" will not be updated.\n`,
        ),
      );
      return;
    }

    await writeAlias(config, filePath);
    console.log(
      chalk.green(
      `\nThe account configuration "${config.accountAlias}" has been saved.\n`,
      ),
    );
  }
);
