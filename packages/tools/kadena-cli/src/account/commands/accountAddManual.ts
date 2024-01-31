import type { Command } from 'commander';
import debug from 'debug';
import { assertCommandError } from '../../utils/command.util.js';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import { addAccount } from '../utils/addAccount.js';
import {
  displayAddAccountSuccess,
  overridePromptCb,
} from '../utils/addHelpers.js';

export const createAddAccountManualCommand: (
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

  async (config): Promise<void> => {
    debug('account-add-manual:action')({ config });
    const result = await addAccount(config, overridePromptCb);

    assertCommandError(result);
    displayAddAccountSuccess(config.accountAlias);
  },
);
