import yaml from 'js-yaml';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

import { ACCOUNT_DIR } from '../../constants/config.js';
import { services } from '../../services/index.js';
import type { IAccountAliasFile } from '../types.js';
import { isEmpty } from '../utils/addHelpers.js';

interface IAccount {
  name: string;
  alias: string;
}

const readAccountFromFile = async (accountFile: string): Promise<IAccount> => {
  const accountAlias = accountFile.split('.')[0];
  const content = await services.filesystem.readFile(
    join(ACCOUNT_DIR, accountFile),
  );
  const account =
    content !== null ? (yaml.load(content) as IAccountAliasFile) : null;
  return {
    name: account?.name ?? '',
    alias: accountAlias,
  };
};

export async function ensureAccountExists(): Promise<void> {
  if (!(await services.filesystem.directoryExists(ACCOUNT_DIR))) {
    console.error(`No account created yet. Please create an account first.`);
    process.exit(1);
  }
}

export async function getAllAccounts(): Promise<IAccount[]> {
  await ensureAccountExists();

  const files = readdirSync(ACCOUNT_DIR);

  const accountNames = await Promise.all(
    files.map((file) => readAccountFromFile(file)),
  );

  return accountNames.flat().filter((account) => !isEmpty(account.name));
}
