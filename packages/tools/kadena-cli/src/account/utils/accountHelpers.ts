import yaml from 'js-yaml';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { z } from 'zod';

import { ACCOUNT_DIR } from '../../constants/config.js';
import { services } from '../../services/index.js';
import { isEmpty } from '../utils/addHelpers.js';

interface IAccount {
  name: string;
  alias: string;
}

const accountAliasFileSchema = z.object({
  name: z.string(),
  fungible: z.string(),
  publicKeys: z.array(z.string()),
  predicate: z.string(),
});

const readAccountFromFile = async (accountFile: string): Promise<IAccount> => {
  const accountAlias = accountFile.split('.')[0];
  const content = await services.filesystem.readFile(
    join(ACCOUNT_DIR, accountFile),
  );
  const account = content !== null ? yaml.load(content) : null;
  const parsedContent = accountAliasFileSchema.parse(account);

  return {
    name: parsedContent.name,
    alias: accountAlias,
  };
};

export async function ensureAccountExists(): Promise<void> {
  if (!(await services.filesystem.directoryExists(ACCOUNT_DIR))) {
    throw new Error('No account created yet. Please create an account first.');
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
