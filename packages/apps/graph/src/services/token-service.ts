import { prismaClient } from '@db/prisma-client';
import type { Token } from '../graph/types/graphql-types';

export async function getTokenDetails(
  accountName: string,
  chainId: string,
): Promise<Token[] | []> {
  const result: Token[] = [];

  const allEvents = await prismaClient.reconcile.findMany({
    where: {
      chainId: parseInt(chainId),
      OR: [{ senderAccount: accountName }, { receiverAccount: accountName }],
    },
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
    if (processedTokens.has(event.token) || !event.token) {
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
      });
      processedTokens.add(event.token);
    }
  });

  return result;
}
