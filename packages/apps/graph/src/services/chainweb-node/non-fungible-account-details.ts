import { getNonFungibleTokenDetails } from '@services/token-service';
import { dotenv } from '@utils/dotenv';
import { withRetry } from '@utils/withRetry';
import type { IGuard } from '../../graph/types/graphql-types';
import { PactCommandError } from './utils';

export interface INonFungibleChainAccountDetails {
  id: string;
  account: string;
  balance: number;
  guard: {
    keys: string[];
    pred: IGuard['predicate'];
  };
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
      if ('cgArgs' in result.guard) {
        result.guard.pred = result.guard.cgArgs[result.guard.cgArgs.length - 1]
          .split(':')
          .pop();
        result.guard.keys = result.guard.cgArgs.map((arg: string) =>
          arg.split(':').slice(0, -1).join(':'),
        );
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
