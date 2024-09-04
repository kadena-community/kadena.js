import { getNonFungibleTokenDetails } from '@services/token-service';
import { dotenv } from '@utils/dotenv';
import { withRetry } from '@utils/withRetry';
import type { IJsonString, IKeyset } from '../../graph/types/graphql-types';
import { PactCommandError } from './utils';

export interface INonFungibleChainAccountDetails {
  id: string;
  account: string;
  balance: number;
  guard: IKeyset | IJsonString;
}

export async function getNonFungibleAccountDetails(
  tokenId: string,
  accountName: string,
  chainId: string,
  version?: string,
): Promise<INonFungibleChainAccountDetails | null> {
  try {
    const commandResult = await getNonFungibleTokenDetails(
      tokenId,
      accountName,
      chainId,
      version,
    );

    const result =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      commandResult as unknown as any as unknown as any;

    if (typeof result.balance === 'object') {
      result.balance = parseFloat(result.balance.decimal);
    }

    if ('guard' in result) {
      if (
        'keys' in result.guard &&
        typeof result.guard.keys === 'object' &&
        'pred' in result.guard &&
        typeof result.guard.pred === 'string'
      ) {
        result.guard = {
          keys: result.guard.keys,
          predicate: result.guard.pred,
        };
      } else {
        result.guard = {
          type: 'Guard',
          value: JSON.stringify(result.guard),
        };
      }
    }

    return result as INonFungibleChainAccountDetails;
  } catch (error) {
    if (
      error.message.includes('with-read: row not found') // Account not found
    ) {
      return null;
    } else {
      throw new PactCommandError('Pact Command failed with error', error);
    }
  }
}

export const getNonFungibleAccountDetailsWithRetry = withRetry(
  getNonFungibleAccountDetails,
  dotenv.CHAINWEB_NODE_RETRY_ATTEMPTS,
  dotenv.CHAINWEB_NODE_RETRY_DELAY,
);
