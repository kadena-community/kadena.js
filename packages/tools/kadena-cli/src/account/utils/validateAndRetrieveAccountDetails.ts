import type {
  IAccountDetailsResult,
  IValidateAccountDetailsConfig,
  Predicate,
} from '../types.js';
import { isEmpty } from './addHelpers.js';
import { compareConfigAndAccountDetails } from './compareConfigAndAccountDetails.js';
import { createAccountName } from './createAccountName.js';
import { getAccountDetails } from './getAccountDetails.js';

export interface IValidateAccountDetailsData {
  isConfigAreSame: boolean;
  accountName: string;
  accountDetails: IAccountDetailsResult | undefined;
}

export async function validateAndRetrieveAccountDetails(
  config: IValidateAccountDetailsConfig,
): Promise<IValidateAccountDetailsData> {
  try {
    const accountName =
      config.accountName === undefined || isEmpty(config.accountName)
        ? await createAccountName({
            publicKeys: config.publicKeysConfig,
            chainId: config.chainId,
            predicate: config.predicate as Predicate,
            networkConfig: config.networkConfig,
          })
        : config.accountName;

    const accountDetails = await getAccountDetails({
      accountName,
      chainId: config.chainId,
      networkId: config.networkConfig.networkId,
      networkHost: config.networkConfig.networkHost,
      fungible: config.fungible,
    });

    const isConfigAreSame =
      accountDetails === undefined
        ? true
        : compareConfigAndAccountDetails(
            {
              keys: config.publicKeysConfig,
              pred: config.predicate,
            },
            accountDetails,
          );

    return {
      accountName,
      accountDetails,
      isConfigAreSame,
    };
  } catch (error) {
    throw new Error(error.message);
  }
}
