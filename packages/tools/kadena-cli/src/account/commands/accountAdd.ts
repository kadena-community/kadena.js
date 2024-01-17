import debug from 'debug';
import type { Command } from 'commander';

import { createCommand } from "../../utils/createCommand.js";
import { globalOptions } from "../../utils/globalOptions.js";

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
  }
);
