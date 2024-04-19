import { prismaClient } from '@db/prisma-client';
import type { ChainId } from '@kadena/client';
import { Pact } from '@kadena/client';
import { dirtyReadClient } from '@kadena/client-utils/core';
import { composePactCommand, execution, setMeta } from '@kadena/client/fp';
import type { Prisma } from '@prisma/client';
import { dotenv } from '@utils/dotenv';
import { nonFungibleAccountDetailsLoader } from '../graph/data-loaders/non-fungible-account-details';
import type {
  INonFungibleTokenBalance,
  INonFungibleTokenInfo,
} from '../graph/types/graphql-types';
import { NonFungibleTokenBalanceName } from '../graph/types/graphql-types';

export async function getNonFungibleTokenBalances(
  accountName: string,
  chainId?: string,
): Promise<INonFungibleTokenBalance[] | []> {
  const result: INonFungibleTokenBalance[] = [];

  let whereFilter: Prisma.reconcileWhereInput = {
    OR: [{ senderAccount: accountName }, { receiverAccount: accountName }],
  };

  if (chainId) {
    whereFilter = {
      ...whereFilter,
      chainId: parseInt(chainId),
    };
  }

  const allEvents = await prismaClient.reconcile.findMany({
    where: { ...whereFilter },
    orderBy: {
      eventId: {
        sort: 'desc',
      },
    },
  });

  const processedTokens = new Set();

  if (allEvents.length === 0) {
    return [];
  }

  for (const event of allEvents) {
    const tokenChainIdKey = `${event.token}-${event.chainId}`;

    if (processedTokens.has(tokenChainIdKey) || !event.token) {
      continue;
    }

    let balance = null;
    if (event.senderAccount === accountName && event.senderCurrentAmount) {
      balance = event.senderCurrentAmount;
    } else if (
      event.receiverAccount === accountName &&
      event.receiverCurrentAmount
    ) {
      balance = event.receiverCurrentAmount;
    }

    if (balance) {
      const finalChainId = event.chainId
        ? event.chainId.toString()
        : dotenv.SIMULATE_DEFAULT_CHAIN_ID.toString();

      const accountDetails = await nonFungibleAccountDetailsLoader.load({
        tokenId: event.token,
        accountName: accountName,
        chainId: finalChainId,
      });

      result.push({
        __typename: NonFungibleTokenBalanceName,
        balance,
        accountName,
        tokenId: event.token,
        chainId: finalChainId,
        guard: {
          keys: accountDetails!.guard.keys,
          predicate: accountDetails!.guard.pred,
        },
        version: event.version!,
      });
      processedTokens.add(tokenChainIdKey);
    }
  }

  return result;
}

/**
 * Get the chain ids for which the account has tokens
 *
 */
export async function checkAccountChains(
  accountName: string,
): Promise<string[]> {
  const chainIds = new Set<string>();
  const allEvents = await prismaClient.reconcile.findMany({
    where: {
      OR: [{ senderAccount: accountName }, { receiverAccount: accountName }],
    },
    select: {
      chainId: true,
    },
    distinct: ['chainId'],
  });

  allEvents.forEach((event) => {
    if (event.chainId?.toString()) {
      chainIds.add(event.chainId.toString());
    }
  });

  return Array.from(chainIds);
}

export async function getNonFungibleTokenInfo(
  tokenId: string,
  chainId: string,
  version: string,
): Promise<INonFungibleTokenInfo | null> {
  if (version !== 'v1' && version !== 'v2') {
    throw new Error(
      `Invalid version found for token ${tokenId}. Got ${version} but expected v1 or v2.`,
    );
  }

  let executionCmd;

  if (version === 'v1') {
    // Note: Alternative approach left for reference
    // executionCmd = execution(
    //   Pact.modules['marmalade.ledger']['get-policy-info'](tokenId),
    // );
    executionCmd = execution(`(bind
        (marmalade.ledger.get-policy-info "${tokenId}")
        {"token" := token }
        (bind
            token
            { "id" := id, "precision":= precision, "supply":= supply, "manifest":= manifest }
            { "id": id, "precision": precision, "supply": supply, "uri":
                (format
                    "data:{},{}"
                    [
                      (at 'scheme (at 'uri manifest))
                      (at 'data (at 'uri manifest))
                    ]
                )
            }
        )
    )`);
  } else {
    executionCmd = execution(
      Pact.modules['marmalade-v2.ledger']['get-token-info'](tokenId),
    );
    // Note: Alternative approach left for reference
    // executionCmd = execution(`(bind
    //    (marmalade-v2.ledger.get-token-info "${tokenId}")
    //    { "id" := id, "precision":= precision, "supply" := supply, "uri" := uri }
    //    { "id" : id, "precision": precision, "supply" : supply, "uri" : uri }
    //  )`);
  }

  const command = composePactCommand(
    executionCmd,

    setMeta({
      chainId: chainId as ChainId,
    }),
  );

  const config = {
    host: dotenv.NETWORK_HOST,
    defaults: {
      networkId: dotenv.NETWORK_ID,
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tokenInfo = await dirtyReadClient<any>(config)(command).execute();

  if (!tokenInfo) {
    return null;
  }

  // Note: Alternative approach left for reference
  // if (version === 'v1') {
  //   if ('token' in tokenInfo) {
  //     tokenInfo = tokenInfo.token;
  //   }

  //   if ('manifest' in tokenInfo) {
  //     tokenInfo.uri = `data:${tokenInfo.manifest.uri.scheme},${tokenInfo.manifest.uri.data}`;
  //   }
  // }

  if ('precision' in tokenInfo) {
    if (
      typeof tokenInfo.precision === 'object' &&
      tokenInfo.precision !== null
    ) {
      tokenInfo.precision = (tokenInfo.precision as { int: number }).int;
    }
  }

  if ('policies' in tokenInfo) {
    if (!Array.isArray(tokenInfo.policies)) {
      tokenInfo.policies = tokenInfo.policies.map((policy: string) => ({
        moduleName: policy,
      }));
    }
  } else if ('policy' in tokenInfo) {
    tokenInfo.policies = { moduleName: tokenInfo.policy.toString() };
  }

  return tokenInfo as INonFungibleTokenInfo;
}
