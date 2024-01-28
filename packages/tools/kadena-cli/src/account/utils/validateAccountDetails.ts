import type { CommandResult } from '../../utils/command.util.js';
import type {
  IAccountDetailsResult,
  IAddAccountManualConfig,
} from '../types.js';
import { compareConfigAndAccountDetails } from './compareConfigAndAccountDetails.js';
import { createAccountName } from './createAccountName.js';
import { getAccountDetailsFromChain } from './getAccountDetails.js';

export interface IValidateAccountDetailsData {
  isConfigAreSame: boolean;
  config: IAddAccountManualConfig;
  accountDetails: IAccountDetailsResult;
}

export async function validateAccountDetails(
  config: IAddAccountManualConfig,
): Promise<CommandResult<IValidateAccountDetailsData>> {
  try {
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
      success: true,
      data: {
        config: configWithAccountName,
        accountDetails,
        isConfigAreSame,
      },
    };
  } catch (error) {
    if (error.message.includes('row not found') === true) {
      return {
        success: false,
        errors: [
          `The account is not on chain yet. To create it on-chain, transfer funds to it from ${config.networkConfig.network} and use "fund" command.`,
        ],
      };
    }
    return {
      success: false,
      errors: [error.message],
    };
  }
}
