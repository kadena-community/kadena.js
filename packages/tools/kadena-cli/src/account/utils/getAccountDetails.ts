import { details } from '@kadena/client-utils/coin';
import type { ChainId } from '@kadena/types';
import type { IAccountDetailsResult } from '../types.js';

export interface IGetAccountDetailsParams {
  accountName: string;
  chainId: ChainId;
  networkId: string;
  networkHost: string;
  fungible: string;
}

export async function getAccountDetailsFromChain({
  accountName,
  chainId,
  networkId,
  networkHost,
  fungible,
}: IGetAccountDetailsParams): Promise<IAccountDetailsResult> {
  try {
    const accountDetails = await details(
      accountName,
      networkId,
      chainId,
      networkHost,
      fungible,
    );

    if (accountDetails === undefined) {
      throw new Error(`Account ${accountName}: row not found.`);
    }

    return accountDetails as IAccountDetailsResult;
  } catch (error) {
    throw new Error(error.message);
  }
}

export const getAccountDetails = async (
  config: IGetAccountDetailsParams,
): Promise<IAccountDetailsResult | undefined> => {
  try {
    const accountDetails = await getAccountDetailsFromChain(config);

    return accountDetails;
  } catch (error) {
    if (error.message.includes('row not found') === true) {
      return;
    }
    throw new Error(error.message);
  }
};
