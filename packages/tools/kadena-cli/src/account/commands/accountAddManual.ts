import debug from 'debug';
import type { Command } from 'commander';
import path from 'path';
import { createCommand } from "../../utils/createCommand.js";
import { globalOptions } from "../../utils/globalOptions.js";
import { defaultAccountPath } from '../../constants/account.js';
import { sanitizeFilename } from '../../utils/helpers.js';
import { checkAccountDetails, handleExistingAccount } from '../utils/addHelpers.js';

export const addAccountManualCommand: (program: Command, version: string) => void = createCommand(
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function addAccount(config: any): Promise<void> {
    debug('account-add-manual:action')({ config });

    const sanitizedAlias = sanitizeFilename(config.accountAlias).toLowerCase();
    const filePath = path.join(defaultAccountPath, `${sanitizedAlias}.yaml`);

    const newConfig = await checkAccountDetails(config);

    await handleExistingAccount(filePath, newConfig);
  }
);
