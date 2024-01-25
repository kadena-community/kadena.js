import { IAccountDetailsResult, IAddAccountManualConfig } from '../types.js';

export const isEmpty = (value?: string): boolean =>
  value === undefined || value === '' || value === null;

export const getUpdatedConfig = (
  config: IAddAccountManualConfig,
  accountDetails: IAccountDetailsResult,
  updateOption: string,
) => {
  if (updateOption === 'userInput') {
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
