import type { Command } from 'commander';
import { parse } from 'node:path';
import { NO_ACCOUNTS_FOUND_ERROR_MESSAGE } from '../../constants/account.js';
import { createCommand } from '../../utils/createCommand.js';
import {
  isNotEmptyString,
  maskStringPreservingStartAndEnd,
  truncateText,
} from '../../utils/helpers.js';
import { log } from '../../utils/logger.js';
import { accountOptions } from '../accountOptions.js';
import type { IAliasAccountData } from '../types.js';
import {
  ensureAccountAliasFilesExists,
  getAllAccounts,
  readAccountFromFile,
} from '../utils/accountHelpers.js';

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
    truncateText(parse(account.alias).name, 32),
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

async function accountList(
  accountAlias: string,
): Promise<IAliasAccountData[] | undefined> {
  try {
    if (accountAlias === 'all') {
      return await getAllAccounts();
    } else {
      const account = await readAccountFromFile(accountAlias);
      return [account];
    }
  } catch (error) {
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
    const isAccountAliasesExist = await ensureAccountAliasFilesExists();

    if (!isAccountAliasesExist) {
      return log.error(NO_ACCOUNTS_FOUND_ERROR_MESSAGE);
    }

    const { accountAlias } = await option.accountAlias();

    log.debug('account-list:action', accountAlias);

    if (!isNotEmptyString(accountAlias)) {
      return log.error('No account alias is selected');
    }

    const accountsDetails = await accountList(accountAlias);

    if (!accountsDetails || accountsDetails.length === 0) {
      return log.error(`Selected account alias "${accountAlias}" not found.`);
    }

    const tabularData = generateTabularData(accountsDetails);

    log.output(
      log.generateTableString(tabularData.header, tabularData.data),
      accountsDetails,
    );
  },
);
