import path from 'path';

import { KadenaError } from '../../../services/service-error.js';
import { sanitizeFilename } from '../../../utils/globalHelpers.js';
import { log } from '../../../utils/logger.js';
import { relativeToCwd } from '../../../utils/path.util.js';
import type { IAccountDetailsResult, IAddAccountConfig } from '../types.js';
import { getAccountDirectory } from './accountHelpers.js';

export const isEmpty = (value?: string | null): boolean =>
  value === undefined || value === '' || value === null;

export const getUpdatedConfig = (
  config: IAddAccountConfig,
  accountDetails: IAccountDetailsResult,
  accountOverwriteFromChain: boolean,
): IAddAccountConfig => {
  if (
    accountOverwriteFromChain === false ||
    accountDetails === undefined ||
    accountDetails.guard.keys.length === 0
  ) {
    return config;
  } else {
    const updatedConfig = {
      ...config,
      publicKeys: accountDetails.guard.keys.join(','),
      publicKeysConfig: accountDetails.guard.keys,
      predicate: accountDetails.guard.pred,
    };
    return updatedConfig;
  }
};

export const getAccountFilePath = (fileName: string): string => {
  const accountDir = getAccountDirectory();
  if (accountDir === null) {
    throw new KadenaError('no_kadena_directory');
  }
  const sanitizedAlias = sanitizeFilename(fileName);
  return path.join(accountDir, `${sanitizedAlias}.yaml`);
};

export const displayAddAccountSuccess = (
  accountAlias: string,
  path: string,
): void => {
  log.info(
    log.color.green(
      `\nThe account configuration "${accountAlias}" has been saved in ${relativeToCwd(
        path,
      )}\n`,
    ),
  );
};
