import chalk from 'chalk';
import path from 'path';

import { defaultAccountPath } from '../../constants/account.js';
import { sanitizeFilename } from '../../utils/helpers.js';
import type {
  IAccountDetailsResult,
  IAddAccountManualConfig,
} from '../types.js';

export const isEmpty = (value?: string): boolean =>
  value === undefined || value === '' || value === null;

export const getUpdatedConfig = (
  config: IAddAccountManualConfig,
  accountDetails: IAccountDetailsResult,
  accountOverwriteFromChain: boolean,
): IAddAccountManualConfig => {
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
  const sanitizedAlias = sanitizeFilename(fileName);
  return path.join(defaultAccountPath, `${sanitizedAlias}.yaml`);
};

export const displayAddAccountSuccess = (accountAlias: string): void => {
  console.log(
    chalk.green(
      `\nThe account configuration "${accountAlias}" has been saved.\n`,
    ),
  );
};
