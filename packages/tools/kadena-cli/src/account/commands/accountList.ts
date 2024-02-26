import type { Command } from 'commander';
import { createCommand } from '../../utils/createCommand.js';
import {
  maskStringPreservingStartAndEnd,
  truncateText,
} from '../../utils/helpers.js';
import { log } from '../../utils/logger.js';
import { accountOptions } from '../accountOptions.js';
import type { IAliasAccountData } from '../types.js';
import { getAllAccounts } from '../utils/accountHelpers.js';

function generateTabularData(accounts: IAliasAccountData[]): {
  header: string[];
  data: string[][];
} {
  const header = [
    'Account Alias',
    'Account Name',
    'Public Key(s)',
    'Predicate',
    'Fungible',
  ];

  const data = accounts.map((account) => [
    truncateText(account.alias, 32),
    maskStringPreservingStartAndEnd(account.name, 32),
    account.publicKeys
      .map((key) => maskStringPreservingStartAndEnd(key, 24))
      .join('\n'),
    account.predicate,
    account.fungible,
  ]);

  return {
    header,
    data,
  };
}

async function accountList(config: {
  accountAlias: string;
  accountAliasConfig: IAliasAccountData | undefined;
}): Promise<IAliasAccountData[] | undefined> {
  if (config.accountAlias === 'all') {
    return await getAllAccounts();
  } else if (config.accountAliasConfig) {
    return [config.accountAliasConfig];
  } else {
    return;
  }
}

export const createAccountListCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'list',
  'List all available accounts',
  [accountOptions.accountSelectWithAll()],
  async (option) => {
    const accountAlias = await option.accountAlias();

    log.debug('account-list:action', accountAlias);

    const accounts = await accountList(accountAlias);

    if (!accounts) {
      return log.error(
        `Selected account "${accountAlias.accountAlias}" not found.`,
      );
    }

    const tabularData = generateTabularData(accounts);

    log.output(log.generateTableString(tabularData.header, tabularData.data));
  },
);
