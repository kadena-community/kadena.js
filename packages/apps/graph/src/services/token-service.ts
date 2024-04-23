import { prismaClient } from '@db/prisma-client';
import type { Prisma } from '@prisma/client';
import { dotenv } from '@utils/dotenv';
import { nonFungibleAccountDetailsLoader } from '../graph/data-loaders/non-fungible-account-details';
import type { INonFungibleTokenBalance } from '../graph/types/graphql-types';
import { NonFungibleTokenBalanceName } from '../graph/types/graphql-types';

export async function getTokenDetails(
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
