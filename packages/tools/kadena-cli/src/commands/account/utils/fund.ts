import type { ITransactionDescriptor } from '@kadena/client';
import type { ChainId } from '@kadena/types';
import type { CommandResult } from '../../../utils/command.util.js';
import { isNotEmptyString, notEmpty } from '../../../utils/globalHelpers.js';
import type { INetworkCreateOptions } from '../../networks/utils/networkHelpers.js';
import type { IAliasAccountData } from '../types.js';
import { sortChainIds } from './accountHelpers.js';
import { createAndTransferFund } from './createAndTransferFunds.js';
import { getAccountDetails } from './getAccountDetails.js';
import { transferFund } from './transferFund.js';

const formatAccountCreatedMsgs = (msgs: string[]): string | null => {
  if (msgs.length === 0) return null;
  const [pre, ...chainIds] = msgs;
  const sortedChainIds = sortChainIds(chainIds as ChainId[]);
  return `${pre} ${sortedChainIds.join(
    ', ',
  )}. So the account will be created on these Chain ID(s).`;
};

export async function fund({
  accountConfig,
  amount,
  networkConfig,
  chainIds,
}: {
  accountConfig: Omit<IAliasAccountData, 'alias'>;
  amount: string;
  networkConfig: Pick<INetworkCreateOptions, 'networkId' | 'networkHost'>;
  chainIds: ChainId[];
}): Promise<CommandResult<ITransactionDescriptor[]>> {
  let status: 'success' | 'partial' | 'error' = 'success';
  const errors: string[] = [];
  const warnings: string[] = [];
  const accountCreatedMsgs: string[] = [];
  let accountFundsResult: (ITransactionDescriptor | null)[] = [];
  try {
    accountFundsResult = await Promise.all(
      chainIds.map(async (chainId) => {
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
          if (!accountDetailsFromChain) {
            if (accountCreatedMsgs.length === 0) {
              accountCreatedMsgs.push(
                `Account "${accountConfig.name}" does not exist on Chain ID(s)`,
              );
            }
            accountCreatedMsgs.push(chainId);
          }
          return result;
        } catch (error) {
          status = 'partial';
          warnings.push(`Error on Chain ID ${chainId} - ${error.message}`);
          return null;
        }
      }),
    );
  } catch (error) {
    status = 'error';
    errors.push(error.message);
  }

  const nonEmptyData = accountFundsResult.filter(notEmpty);
  status = nonEmptyData.length === 0 ? 'error' : status;

  const formattedAccountMsgs = formatAccountCreatedMsgs(accountCreatedMsgs);
  if (isNotEmptyString(formattedAccountMsgs)) {
    warnings.push(formattedAccountMsgs);
  }

  return {
    status,
    data: nonEmptyData,
    errors,
    warnings: warnings.filter(notEmpty),
  };
}
