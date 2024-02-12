import type { ChainId } from '@kadena/types';
import type { INetworkCreateOptions } from '../../networks/utils/networkHelpers.js';
import type { CommandResult } from '../../utils/command.util.js';
import type { IAliasAccountData } from '../types.js';
import { createAndTransferFund } from './createAndTransferFunds.js';
import { getAccountDetailsForAddAccount } from './getAccountDetails.js';
import { transferFund } from './transferFund.js';

export async function fund({
  accountConfig,
  amount,
  networkConfig,
  chainId,
}: {
  accountConfig: IAliasAccountData;
  amount: string;
  networkConfig: INetworkCreateOptions;
  chainId: ChainId;
}): Promise<CommandResult<string | undefined>> {
  const accountDetailsFromChain = await getAccountDetailsForAddAccount({
    accountName: accountConfig.name,
    networkId: networkConfig.networkId,
    chainId: chainId,
    networkHost: networkConfig.networkHost,
    fungible: accountConfig.fungible,
  });

  try {
    const result = accountDetailsFromChain
      ? transferFund({
          receiverAccount: {
            name: accountConfig.name,
          },
          config: {
            contract: accountConfig.fungible,
            amount,
            chainId,
            networkConfig,
          },
        })
      : await createAndTransferFund({
          receiverAccount: {
            name: accountConfig.name,
          },
          config: {
            ...accountConfig,
            networkConfig,
            contract: accountConfig.fungible,
            amount,
            chainId,
          },
        });

    console.log({ onChainResult: result });

    return {
      success: true,
      data: 'Write succeeded',
    };
  } catch (error) {
    return {
      success: false,
      errors: [error.message],
    };
  }
}
