import type { IClient } from '@kadena/client';
import { Pact, createClient } from '@kadena/client';
import type { ChainId } from '@kadena/types';
import { dotenv } from '@utils/dotenv';
import { networkData } from '@utils/network';
import type { Guard } from '../../graph/types/graphql-types';
import { PactCommandError } from './utils';

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type NonFungibleChainAccountDetails = {
  id: string;
  account: string;
  balance: number;
  guard: {
    keys: string[];
    pred: Guard['predicate'];
  };
};

function getClient(chainId: string): IClient {
  return createClient(
    `${dotenv.NETWORK_HOST}/chainweb/${networkData.apiVersion}/${networkData.networkId}/chain/${chainId}/pact`,
  );
}

export async function getNonFungibleAccountDetails(
  tokenId: string,
  accountName: string,
  chainId: string,
): Promise<NonFungibleChainAccountDetails | null> {
  let result;

  try {
    let result;
    let commandResult;

    commandResult = await getClient(chainId).dirtyRead(
      Pact.builder
        .execution(
          Pact.modules['marmalade.ledger'].details(tokenId, accountName),
        )
        .setMeta({
          chainId: chainId as ChainId,
        })
        .setNetworkId(networkData.networkId)
        .createTransaction(),
    );

    if (commandResult.result.status === 'failure') {
      commandResult = await getClient(chainId).dirtyRead(
        Pact.builder
          .execution(
            Pact.modules['marmalade-v2.ledger'].details(tokenId, accountName),
          )
          .setMeta({
            chainId: chainId as ChainId,
          })
          .setNetworkId(networkData.networkId)
          .createTransaction(),
      );
    }

    result = (commandResult.result as unknown as any).data as unknown as any;

    if (typeof result.balance === 'object') {
      result.balance = parseFloat(result.balance.decimal);
    }

    return result as NonFungibleChainAccountDetails;
  } catch (error) {
    if (
      error.message.includes('with-read: row not found') // Account not found
    ) {
      return null;
    } else {
      throw new PactCommandError('Pact Command failed with error', result);
    }
  }
}