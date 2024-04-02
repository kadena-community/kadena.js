import { prismaClient } from '@db/prisma-client';
import type { Prisma } from '@prisma/client';
import { dotenv } from '@utils/dotenv';
import type { NonFungibleTokenBalance } from '../graph/types/graphql-types';

export async function getTokenDetails(
  accountName: string,
  chainId?: string,
): Promise<NonFungibleTokenBalance[] | []> {
  const result: NonFungibleTokenBalance[] = [];

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

  allEvents.forEach((event) => {
    const tokenChainIdKey = `${event.token}-${event.chainId}`;

    if (processedTokens.has(tokenChainIdKey) || !event.token) {
      return;
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
      result.push({
        balance,
        id: event.token,
        chainId: event.chainId
          ? event.chainId.toString()
          : dotenv.SIMULATE_DEFAULT_CHAIN_ID.toString(),
        version: event.version!,
      });
      processedTokens.add(tokenChainIdKey);
    }
  });

  return result;
}

/**
 * Get the chain ids for which the account has tokens
 *
 */
export async function checkAccountChains(accountName: string) {
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
