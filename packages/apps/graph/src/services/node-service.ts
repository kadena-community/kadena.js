import type { ICommandResult } from '@kadena/chainweb-node-client';
import { createClient } from '@kadena/client';
import { details } from '@kadena/client-utils/coin';
import { dirtyReadClient } from '@kadena/client-utils/core';
import { hash as hashFunction } from '@kadena/cryptography-utils';
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

export const estimateGas = async ({
  cmd,
  hash = undefined,
  sigs = [],
}: {
  cmd: string;
  hash?: string | undefined | null;
  sigs?: string[] | undefined | null;
}): Promise<ICommandResult> => {
  return await createClient(
    ({ chainId }) =>
      `${dotenv.NETWORK_HOST}/chainweb/0.0/${dotenv.NETWORK_ID}/chain/${chainId}/pact`,
  ).local(
    {
      cmd,
      hash: hash || hashFunction(cmd),
      sigs:
        sigs?.map((sig) => ({
          sig: sig,
        })) || [],
    },
    {
      preflight: true,
      signatureVerification: false,
    },
  );
};
