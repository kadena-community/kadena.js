import { details } from '@kadena/client-utils/coin';
import type { ChainId } from '@kadena/types';
import { dotenv } from '@utils/dotenv';
import { networkData } from '@utils/network';
import type { IGuard } from '../../graph/types/graphql-types';
import { PactCommandError } from './utils';

export interface IFungibleChainAccountDetails {
  account: string;
  balance: number;
  guard: {
    keys: string[];
    pred: IGuard['predicate'];
  };
}

export async function getFungibleAccountDetails(
  fungibleName: string,
  accountName: string,
  chainId: string,
  retries = dotenv.CHAINWEB_NODE_RETRY_ATTEMPTS,
  delay = dotenv.CHAINWEB_NODE_RETRY_DELAY,
): Promise<IFungibleChainAccountDetails | null> {
  let result;

  try {
    result = (await details(
      accountName,
      networkData.networkId,
      chainId as ChainId,
      dotenv.NETWORK_HOST,
      fungibleName,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    )) as any;

    if (typeof result.balance === 'object') {
      result.balance = parseFloat(result.balance.decimal);
    }

    return result as IFungibleChainAccountDetails;
  } catch (error) {
    if (
      error.message.includes('with-read: row not found') || // Account not found
      error.message.includes('Cannot resolve') // Fungible or contract not found
    ) {
      return null;
    } else {
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        return getFungibleAccountDetails(
          fungibleName,
          accountName,
          chainId,
          retries - 1,
        );
      } else {
        throw new PactCommandError('Pact Command failed with error', result);
      }
    }
  }
}
