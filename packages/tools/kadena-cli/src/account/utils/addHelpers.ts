import chalk from 'chalk';
import path from 'path';

import { defaultAccountPath } from '../../constants/account.js';
import { updateAccountDetailsPrompt } from '../../prompts/account.js';
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
  overrideFromChain: boolean,
): IAddAccountManualConfig => {
  if (overrideFromChain === false) {
    return config;
  } else {
    const updatedConfig = {
      ...config,
      publicKeys: accountDetails.publicKeys.join(','),
      publicKeysConfig: accountDetails.publicKeys,
      predicate: accountDetails.predicate,
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

export async function overridePromptCb(): Promise<boolean> {
  const updateOption = await updateAccountDetailsPrompt();
  return updateOption === 'chain';
}
