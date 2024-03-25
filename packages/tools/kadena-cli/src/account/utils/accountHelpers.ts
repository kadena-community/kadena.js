import yaml from 'js-yaml';
import { extname, join } from 'node:path';
import type { ZodError, ZodIssue } from 'zod';
import { z } from 'zod';
import type { IAliasAccountData } from './../types.js';

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
  const ext = extname(accountFile);
  const fileWithExt =
    !ext || ext !== '.yaml' ? `${accountFile}.yaml` : accountFile;
  const filePath = join(ACCOUNT_DIR, fileWithExt);

  if (!(await services.filesystem.fileExists(filePath))) {
    throw new Error(`Account alias "${accountFile}" file not exist`);
  }

  const content = await services.filesystem.readFile(filePath);
  const account = content !== null ? yaml.load(content) : null;
  try {
    const parsedContent = accountAliasFileSchema.parse(account);
    return {
      ...parsedContent,
      alias: fileWithExt,
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

export async function ensureAccountAliasDirectoryExists(): Promise<boolean> {
  return await services.filesystem.directoryExists(ACCOUNT_DIR);
}

export async function ensureAccountAliasFilesExists(): Promise<boolean> {
  if (!(await ensureAccountAliasDirectoryExists())) {
    return false;
  }

  const files = await services.filesystem.readDir(ACCOUNT_DIR);

  return files.length > 0;
}

export async function getAllAccounts(): Promise<IAliasAccountData[]> {
  if (!(await ensureAccountAliasDirectoryExists())) {
    return [];
  }

  const files = await services.filesystem.readDir(ACCOUNT_DIR);

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
  .int()
  .min(0)
  .max(19);

export const chainIdRangeValidation = z
  .array(
    z
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
      .int()
      .min(0)
      .max(19),
  )
  .nonempty();

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

export const getChainIdRangeSeparator = (
  input: string,
): ',' | '-' | undefined => {
  const hasComma = input.includes(',');
  const hasHyphen = input.includes('-');
  return hasComma ? ',' : hasHyphen ? '-' : undefined;
};

const getChainIds = (
  input: string,
  separator?: ',' | '-',
): number[] | undefined => {
  if (isEmpty(separator)) {
    return [parseInt(input.trim(), 10)];
  } else if (separator === ',') {
    const splitValue = new Set(input.split(','));
    return [...splitValue]
      .map((id) => parseInt(id.trim(), 10))
      .filter(notEmpty);
  } else if (separator === '-') {
    let [start, end] = input.split('-').map((id) => parseInt(id.trim(), 10));
    if (start > end) {
      const temp = start;
      start = end;
      end = temp;
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }
};

export const parseChainIdRange = (input: string): number[] | undefined => {
  const indexRangeSeparator = getChainIdRangeSeparator(input);
  const chainIds = getChainIds(input, indexRangeSeparator);
  return chainIds;
};

export const getTransactionExplorerUrl = (
  explorerURL: string,
  requestKey: string,
): string => {
  const baseURL = explorerURL.endsWith('/') ? explorerURL : `${explorerURL}/`;
  return `${baseURL}${requestKey}`;
};
