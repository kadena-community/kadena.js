import { prismaClient } from '@db/prisma-client';
import type { ResolveCursorConnectionArgs } from '@pothos/plugin-relay';
import { resolveCursorConnection } from '@pothos/plugin-relay';
import type { Prisma } from '@prisma/client';
import type { IContext } from '../builder';
import { prismaTransactionsMapper } from '../mappers/transaction-mapper';

export async function resolveTransactionConnection(
  args: any,
  context: IContext,
  whereCondition: Prisma.TransactionWhereInput,
) {
  return await resolveCursorConnection(
    {
      args,
      toCursor: (transaction) => {
        if ('blockHash' in transaction.result) {
          return Buffer.from(
            JSON.stringify([transaction.hash, transaction.result.blockHash]),
          ).toString('base64');
        } else {
          throw new Error('Transaction does not contain block hash');
        }
      },
    },
    async ({ before, after, limit, inverted }: ResolveCursorConnectionArgs) => {
      const orderByDirection = inverted ? 'asc' : 'desc';

      let cursor;
      let take;
      if (before) {
        take = -limit;
        const [requestKey, blockHash] = JSON.parse(
          Buffer.from(before, 'base64').toString(),
        );
        cursor = {
          blockHash_requestKey: {
            blockHash,
            requestKey,
          },
        };
      } else if (after) {
        take = limit;
        const [requestKey, blockHash] = JSON.parse(
          Buffer.from(after, 'base64').toString(),
        );
        cursor = {
          blockHash_requestKey: {
            blockHash,
            requestKey,
          },
        };
      }

      const prismaTransactions = await prismaClient.transaction.findMany({
        take,
        skip: after ? 1 : 0,
        cursor,
        where: {
          ...whereCondition,
        },
        orderBy: [
          { height: orderByDirection },
          { blockHash: orderByDirection },
        ],
      });

      return await prismaTransactionsMapper(prismaTransactions, context);
    },
  );
}
