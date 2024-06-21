import type { Table } from 'cli-table3';
import type { Command } from 'commander';
import { parse } from 'node:path';
import { NO_ACCOUNTS_FOUND_ERROR_MESSAGE } from '../../../constants/account.js';
import { services } from '../../../services/index.js';
import { createCommand } from '../../../utils/createCommand.js';
import { isNotEmptyString } from '../../../utils/globalHelpers.js';
import { log } from '../../../utils/logger.js';
import { createTable } from '../../../utils/table.js';
import { accountOptions } from '../accountOptions.js';
import type { IAliasAccountData } from '../types.js';

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

export const createAccountListCommand: (
  program: Command,
  version: string,
) => void = createCommand(
  'list',
  'List all available accounts',
  [accountOptions.accountSelectWithAll()],
  async (option) => {
    const { accountAlias } = await option.accountAlias();

    log.debug('account-list:action', { accountAlias });

    if (!isNotEmptyString(accountAlias)) {
      return log.error('No account alias is selected');
    }

    if (accountAlias === 'all') {
      const accountsDetails = await services.account.list();

      if (accountsDetails.length === 0) {
        return log.warning(NO_ACCOUNTS_FOUND_ERROR_MESSAGE);
      }

      const data = generateTabularData(accountsDetails);
      log.output(data.toString(), accountsDetails);
    } else {
      const accountsDetails = await services.account.getByAlias(accountAlias);

      if (!accountsDetails) {
        return log.error(`Selected account alias "${accountAlias}" not found.`);
      }

      const data = generateTabularData([accountsDetails]);
      log.output(data.toString(), accountsDetails);
    }
  },
);
