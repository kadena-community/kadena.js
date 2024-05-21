import type { Table } from 'cli-table3';
import type { Command } from 'commander';
import { parse } from 'node:path';
import { NO_ACCOUNTS_FOUND_ERROR_MESSAGE } from '../../constants/account.js';
import { createCommand } from '../../utils/createCommand.js';
import { isNotEmptyString } from '../../utils/globalHelpers.js';
import { log } from '../../utils/logger.js';
import { createTable } from '../../utils/table.js';
import { accountOptions } from '../accountOptions.js';
import type { IAliasAccountData } from '../types.js';
import {
  ensureAccountAliasFilesExists,
  getAllAccounts,
  readAccountFromFile,
} from '../utils/accountHelpers.js';

function generateTabularData(accounts: IAliasAccountData[]): Table {
  const table = createTable({});
  const header: Record<string, string> = {
    publicKeys: 'Public Keys',
    name: 'Account Name',
    fungible: 'Fungible',
    predicate: 'Predicate',
  };

  accounts.map((account) => {
    table.push([
      { colSpan: 2, content: `Account Alias: ${parse(account.alias).name}` },
    ]);
    Object.entries(account).forEach(([key, val]) => {
      if (key === 'alias') return;
      const value = key === 'publicKeys' ? val.join('\n') : val;
      const headerKey = header[key] || key;
      table.push({
        [log.color.green(headerKey)]: value,
      });
    });
    table.push([{ colSpan: 2, content: '' }]);
  });

  return table;
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

    const data = generateTabularData(accountsDetails);
    const accountsListJSONOutput =
      accountsDetails.length === 1 ? accountsDetails[0] : accountsDetails;
    log.output(data.toString(), accountsListJSONOutput);
  },
);
