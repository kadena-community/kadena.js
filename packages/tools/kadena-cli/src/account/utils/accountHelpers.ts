import yaml from 'js-yaml';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import type { ZodError, ZodIssue } from 'zod';
import { z } from 'zod';
import type { IAliasAccountData } from './../types.js';

import { NO_ACCOUNT_ERROR_MESSAGE } from '../../constants/account.js';
import { ACCOUNT_DIR } from '../../constants/config.js';
import { services } from '../../services/index.js';
import { notEmpty } from '../../utils/helpers.js';
import { isEmpty } from './addHelpers.js';

export const accountAliasFileSchema = z.object({
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

export const readAccountFromFile = async (
  accountFile: string,
): Promise<IAliasAccountData> => {
  const content = await services.filesystem.readFile(
    join(ACCOUNT_DIR, accountFile),
  );
  const account = content !== null ? yaml.load(content) : null;
  try {
    const parsedContent = accountAliasFileSchema.parse(account);
    return {
      ...parsedContent,
      alias: accountFile,
    };
  } catch (error) {
    if (isEmpty(content)) {
      throw new Error(
        `Error parsing alias file: ${accountFile}, file is empty`,
      );
    }

    const errorMessage = formatZodErrors(error);
    throw new Error(`Error parsing alias file: ${accountFile} ${errorMessage}`);
  }
};

export async function ensureAccountExists(): Promise<void> {
  if (!(await services.filesystem.directoryExists(ACCOUNT_DIR))) {
    throw new Error(NO_ACCOUNT_ERROR_MESSAGE);
  }
}

export async function getAllAccounts(): Promise<IAliasAccountData[]> {
  await ensureAccountExists();

  const files = readdirSync(ACCOUNT_DIR);

  const allAccounts = await Promise.all(
    files.map((file) => readAccountFromFile(file).catch(() => null)),
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

export const formatZodFieldErrors = (error: ZodError): string =>
  error.errors.map((e: ZodIssue) => e.message).join('\n');

export const chainIdValidation = z
  .number({
    errorMap: (error) => {
      if (error.code === 'too_small') {
        return {
          message: 'must be greater than or equal to 0',
        };
      }

      if (error.code === 'too_big') {
        return {
          message: 'must be less than or equal to 19',
        };
      }

      return {
        message: 'must be a number',
      };
    },
  })
  .min(0)
  .max(19);

export const fundAmountValidation = z
  .number({
    errorMap: (error) => {
      if (error.code === 'too_small') {
        return {
          message: 'must be greater than or equal to 1',
        };
      }

      if (error.code === 'too_big') {
        return {
          message: 'must be less than or equal to 100',
        };
      }

      return {
        message: 'must be a positive number (1 - 100)',
      };
    },
  })
  .min(1)
  .max(100);
