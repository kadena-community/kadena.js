import type {
  IAccountDetailsResult,
  IAddAccountManualConfig,
} from '../types.js';
import { compareConfigAndAccountDetails } from './compareConfigAndAccountDetails.js';
import { createAccountName } from './createAccountName.js';
import { getAccountDetailsFromChain } from './getAccountDetails.js';

interface IValidateAccountDetails {
  isConfigAreSame: boolean;
  config: IAddAccountManualConfig;
  accountDetails: IAccountDetailsResult;
}

export async function validateAccountDetails(
  config: IAddAccountManualConfig,
): Promise<IValidateAccountDetails> {
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
    config: configWithAccountName,
    accountDetails,
    isConfigAreSame,
  };
}
