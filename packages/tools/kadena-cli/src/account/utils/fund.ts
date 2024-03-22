import type { ITransactionDescriptor } from '@kadena/client';
import type { ChainId } from '@kadena/types';
import type { INetworkCreateOptions } from '../../networks/utils/networkHelpers.js';
import type { CommandResult } from '../../utils/command.util.js';
import type { IAliasAccountData } from '../types.js';
import { createAndTransferFund } from './createAndTransferFunds.js';
import { getAccountDetails } from './getAccountDetails.js';
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
}): Promise<CommandResult<ITransactionDescriptor>> {
  try {
    const accountDetailsFromChain = await getAccountDetails({
      accountName: accountConfig.name,
      networkId: networkConfig.networkId,
      chainId: chainId,
      networkHost: networkConfig.networkHost,
      fungible: accountConfig.fungible,
    });

    const result = accountDetailsFromChain
      ? await transferFund({
          accountName: accountConfig.name,
          config: {
            contract: accountConfig.fungible,
            amount,
            chainId,
            networkConfig,
          },
        })
      : await createAndTransferFund({
          account: {
            name: accountConfig.name,
            publicKeys: accountConfig.publicKeys,
            predicate: accountConfig.predicate,
          },
          config: {
            ...accountConfig,
            networkConfig,
            contract: accountConfig.fungible,
            amount,
            chainId,
          },
        });

    return {
      status: 'success',
      data: result,
    };
  } catch (error) {
    return {
      status: 'error',
      errors: [error.message],
    };
  }
}
