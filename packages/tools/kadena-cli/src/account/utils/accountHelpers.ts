import yaml from 'js-yaml';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { ZodError } from 'zod';
import { z } from 'zod';

import { ACCOUNT_DIR } from '../../constants/config.js';
import { services } from '../../services/index.js';
import { notEmpty } from '../../utils/helpers.js';
import { isEmpty } from './addHelpers.js';

interface IAccount {
  name: string;
  fungible: string;
  publicKeys: string[];
  predicate: string;
  alias: string;
}

const accountAliasFileSchema = z.object({
  name: z.string(),
  fungible: z.string(),
  publicKeys: z.array(z.string()),
  predicate: z.string(),
});

export const formatZodErrors = (errors: ZodError): string => {
  return errors.errors
    .map((error) => {
      if (error.code === 'invalid_type') {
        return `"${error.path}": expected ${error.expected}, received ${error.received}`;
      }
      return error.message;
    })
    .join('\n');
};

const readAccountFromFile = async (accountFile: string): Promise<IAccount> => {
  const accountAlias = accountFile.split('.')[0];
  const content = await services.filesystem.readFile(
    join(ACCOUNT_DIR, accountFile),
  );
  const account = content !== null ? yaml.load(content) : null;
  try {
    const parsedContent = accountAliasFileSchema.parse(account);
    return {
      ...parsedContent,
      alias: accountAlias,
    };
  } catch (error) {
    if (isEmpty(content)) {
      throw new Error(
        `Error parsing alias file: ${accountFile}, file is empty`,
      );
    }

    const errorMessage = formatZodErrors(error);
    throw new Error(
      `Error parsing alias file: ${accountFile} ${errorMessage}`,
    );
  }
};

export async function ensureAccountExists(): Promise<void> {
  if (!(await services.filesystem.directoryExists(ACCOUNT_DIR))) {
    throw new Error('No account created yet. Please create an account first.');
  }
}

export async function getAllAccounts(): Promise<IAccount[]> {
  await ensureAccountExists();

  const files = readdirSync(ACCOUNT_DIR);

  const allAccounts = await Promise.all(
    files.map((file) =>
      readAccountFromFile(file).catch((error) => {
        throw new Error(error.message);
      }),
    ),
  );

  return allAccounts.flat().filter(notEmpty);
}

export async function getAllAccountNames(): Promise<
  {
    alias: string;
    name: string;
  }[]
> {
  const allAccountDetails = await getAllAccounts();
  return allAccountDetails.map(({ alias, name }) => ({ alias, name }));
}
