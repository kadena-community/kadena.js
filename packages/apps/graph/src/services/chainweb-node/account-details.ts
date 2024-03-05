import { details } from '@kadena/client-utils/coin';
import type { ChainId } from '@kadena/types';
import { dotenv } from '@utils/dotenv';
import { networkConfig } from '../..';
import type { Guard } from '../../graph/types/graphql-types';
import { PactCommandError } from './utils';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type FungibleChainAccountDetails = {
  account: string;
  balance: number;
  guard: {
    keys: string[];
    pred: Guard['predicate'];
  };
};

export async function getAccountDetails(
  fungibleName: string,
  accountName: string,
  chainId: string,
): Promise<FungibleChainAccountDetails | null> {
  let result;
  const networkId = (await networkConfig).networkId;

  try {
    result = (await details(
      accountName,
      networkId,
      chainId as ChainId,
      dotenv.NETWORK_HOST,
      fungibleName,
    )) as any;

    if (typeof result.balance === 'object') {
      result.balance = parseFloat(result.balance.decimal);
    }

    return result as FungibleChainAccountDetails;
  } catch (error) {
    if (
      error.message.includes('with-read: row not found') || // Account not found
      error.message.includes('Cannot resolve') // Fungible or contract not found
    ) {
      return null;
    } else {
      throw new PactCommandError('Pact Command failed with error', result);
    }
  }
}
