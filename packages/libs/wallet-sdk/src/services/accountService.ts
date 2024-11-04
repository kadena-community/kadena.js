import { details } from '@kadena/client-utils/coin';
import type { ChainId } from '@kadena/types';
import type { ChainwebHostGenerator } from '../sdk/host.js';
import type {
  IAccountDetails,
  IAccountDetailsResult,
} from '../sdk/interface.js';
import { notEmpty } from '../utils/typeUtils.js';

export async function getAccountDetails(
  accountName: string,
  networkId: string,
  fungible: string,
  chains: ChainId[],
  hostAddressGenerator: ChainwebHostGenerator,
): Promise<IAccountDetails[]> {
  const resultList = await Promise.all(
    chains.map(async (chainId) => {
      try {
        const hostUrl = hostAddressGenerator({ networkId, chainId });
        const url = new URL(hostUrl);
        const accountDetails = (await details(
          accountName,
          networkId,
          chainId,
          url.origin,
          fungible,
        )) as IAccountDetailsResult;

        if (accountDetails === undefined) {
          throw new Error(`Account ${accountName}: row not found.`);
        }

        return {
          chainId,
          accountDetails,
        };
      } catch (error) {
        if (error.message.includes('row not found') === true) {
          return {
            chainId,
            accountDetails: null,
          };
        }
        console.log('error:', error);
        console.error(
          `Error in account details resolving action for chain ${chainId}: ${error.message}`,
        );
        return null;
      }
    }),
  );
  return resultList.filter(notEmpty);
}
