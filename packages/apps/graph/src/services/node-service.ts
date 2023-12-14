import { details } from '@kadena/client-utils/coin';
import { dirtyReadClient } from '@kadena/client-utils/core';
import type { ChainId } from '@kadena/types';
import { dotenv } from '@utils/dotenv';
import type { Guard } from '../graph/types/graphql-types';

export class PactCommandError extends Error {
  public pactError: any;

  constructor(message: string, pactError?: any) {
    super(message);
    this.pactError = pactError;
  }
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type CommandData = {
  key: string;
  value: string;
};

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type ChainFungibleAccountDetails = {
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
): Promise<ChainFungibleAccountDetails | null> {
  let result;
  try {
    result = (await details(
      accountName,
      dotenv.NETWORK_ID,
      chainId as ChainId,
      dotenv.NETWORK_HOST,
      fungibleName,
    )) as any;

    if (typeof result.balance === 'object') {
      result.balance = parseFloat(result.balance.decimal);
    }

    return result as ChainFungibleAccountDetails;
  } catch (error) {
    if (error.message.includes('with-read: row not found')) {
      return null;
    } else {
      throw new PactCommandError('Pact Command failed with error', result);
    }
  }
}

export async function sendRawQuery(
  code: string,
  chainId: string,
  data?: CommandData[],
): Promise<string> {
  let result;
  try {
    result = await dirtyReadClient({
      host: dotenv.NETWORK_HOST,
      defaults: {
        networkId: dotenv.NETWORK_ID,
        meta: { chainId: chainId as ChainId },
        payload: {
          exec: {
            code,
            data:
              data?.reduce(
                (acc, obj) => {
                  acc[obj.key] = obj.value;
                  return acc;
                },
                {} as Record<string, unknown>,
              ) || {},
          },
        },
      },
    })().execute();

    return JSON.stringify(result);
  } catch (error) {
    throw new PactCommandError('Pact Command failed with error', error);
  }
}
