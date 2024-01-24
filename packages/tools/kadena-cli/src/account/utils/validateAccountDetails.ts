import { IAccountDetailsResult, IAddAccountManualConfig } from '../types.js';
import { isEmpty } from './addHelpers.js';
import { compareConfigAndAccountDetails } from './compareConfigAndAccountDetails.js';
import { createAccountName } from './createAccountName.js';
import { getAccountDetailsFromChain } from './getAccountDetails.js';

interface IValidateAccountDetails {
  config: IAddAccountManualConfig;
  accountDetails: IAccountDetailsResult;
}

export async function validateAccountDetails(
  config: IAddAccountManualConfig,
): Promise<[IValidateAccountDetails, boolean]> {
  const accountName = isEmpty(config.accountName)
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

  return [
    {
      config: configWithAccountName,
      accountDetails,
    },
    isConfigAreSame,
  ];
}
