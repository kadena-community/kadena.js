import { prismaClient } from '@db/prisma-client';
import type { Prisma } from '@prisma/client';
import { dotenv } from '@utils/dotenv';
import type { Token } from '../graph/types/graphql-types';

export async function getTokenDetails(
  accountName: string,
  chainId?: string,
): Promise<Token[] | []> {
  const result: Token[] = [];

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
          ? parseInt(event.chainId.toString())
          : parseInt(dotenv.SIMULATE_DEFAULT_CHAIN_ID.toString()),
      });
      processedTokens.add(tokenChainIdKey);
    }
  });

  return result;
}
