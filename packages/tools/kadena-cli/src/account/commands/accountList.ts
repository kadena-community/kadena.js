import type { Command } from 'commander';
import { createCommand } from '../../utils/createCommand.js';
import { globalOptions } from '../../utils/globalOptions.js';
import {
  maskStringPreservingStartAndEnd,
  truncateText,
} from '../../utils/helpers.js';
import { log } from '../../utils/logger.js';
import type { IAliasAccountData } from '../types.js';
import { getAllAccounts } from '../utils/accountHelpers.js';

async function generateAccountTabularData(config: {
  account: string;
  accountConfig: IAliasAccountData | undefined;
}): Promise<{ header: string[]; data: string[][] } | undefined> {
  const header = [
    'Account Alias',
    'Account Name',
    'Public Key(s)',
    'Predicate',
    'Fungible',
  ];
  const data = [];

  if (config.account === 'all') {
    const allAccounts = await getAllAccounts();
    for (const account of allAccounts) {
      data.push([
        truncateText(account.alias, 32),
        maskStringPreservingStartAndEnd(account.name, 32),
        account.publicKeys
          .map((key) => maskStringPreservingStartAndEnd(key, 24))
          .join('\n'),
        account.predicate,
        account.fungible,
      ]);
    }
  } else if (!config.accountConfig) {
    return;
  } else {
    data.push([
      truncateText(config.accountConfig.alias, 40),
      maskStringPreservingStartAndEnd(config.accountConfig.name, 24),
      config.accountConfig.publicKeys
        .map((key) => maskStringPreservingStartAndEnd(key, 24))
        .join('\n'),
      config.accountConfig.predicate,
      config.accountConfig.fungible,
    ]);
  }

  return { header, data };
}

export const createAccountListCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'list',
  'List all available accounts',
  [globalOptions.accountSelectWithAll()],
  async (config) => {
    log.debug('account-list:action', { config });

    const tabularData = await generateAccountTabularData(config);

    if (!tabularData) {
      return log.error(`Selected account "${config.account}" not found.`);
    }

    log.output(
      log.generateTableString(tabularData.header, tabularData.data, true, true),
    );
  },
);
