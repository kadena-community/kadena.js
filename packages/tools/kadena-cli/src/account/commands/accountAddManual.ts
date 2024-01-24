import type { Command } from 'commander';
import debug from 'debug';
import path from 'path';
import { defaultAccountPath } from '../../constants/account.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { sanitizeFilename } from '../../utils/helpers.js';
import { IAddAccountManualConfig } from '../types.js';
import {
  validateAccountDetails,
  writeConfigInFile,
} from '../utils/addHelpers.js';

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

    const sanitizedAlias = sanitizeFilename(config.accountAlias).toLowerCase();
    const filePath = path.join(defaultAccountPath, `${sanitizedAlias}.yaml`);

    const newConfig = await validateAccountDetails(
      config as unknown as IAddAccountManualConfig,
    );

    await writeConfigInFile(filePath, newConfig);
  },
);
