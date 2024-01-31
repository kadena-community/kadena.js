import type {
  IAccountDetailsResult,
  IAddAccountManualConfig,
} from '../types.js';
import { compareConfigAndAccountDetails } from './compareConfigAndAccountDetails.js';
import { createAccountName } from './createAccountName.js';
import { getAccountDetailsFromChain } from './getAccountDetails.js';

export interface IValidateAccountDetailsData {
  isConfigAreSame: boolean;
  configWithAccountName: IAddAccountManualConfig;
  accountDetails: IAccountDetailsResult;
}

export async function validateAccountDetails(
  config: IAddAccountManualConfig,
): Promise<IValidateAccountDetailsData> {
  const accountName =
    config.accountName === undefined
      ? await createAccountName(config)
      : config.accountName;

  const configWithAccountName = {
    ...config,
    accountName,
  };

  const accountDetails = await getAccountDetailsFromChain(
    configWithAccountName,
  );

  const isConfigAreSame = compareConfigAndAccountDetails(
    configWithAccountName,
    accountDetails,
  );

  return {
    configWithAccountName,
    accountDetails,
    isConfigAreSame,
  };
}
