import { prismaClient } from '@db/prisma-client';
import { Prisma, Transaction } from '@prisma/client';
import { getDefaultConnectionComplexity } from '@services/complexity';
import {
  getConditionForMinimumDepth,
  getConfirmationDepth,
} from '@services/depth-service';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';

const generateTransactionFilter = async (args: {
  accountName?: string | null | undefined;
  fungibleName?: string | null | undefined;
  chainId?: string | null | undefined;
  blockHash?: string | null | undefined;
  requestKey?: string | null | undefined;
  minimumDepth?: number | null | undefined;
}): Promise<Prisma.TransactionWhereInput> => ({
  ...(args.accountName && { senderAccount: args.accountName }),
  ...(args.fungibleName && {
    events: {
      some: {
        moduleName: args.fungibleName,
      },
    },
  }),
  ...(args.chainId && { chainId: parseInt(args.chainId) }),
  ...(args.blockHash && { blockHash: args.blockHash }),
  ...(args.requestKey && { requestKey: args.requestKey }),
  ...(args.minimumDepth && {
    OR: await getConditionForMinimumDepth(
      args.minimumDepth,
      args.chainId ? [args.chainId] : undefined,
    ),
  }),
});

builder.queryField('transactions', (t) =>
  t.prismaConnection({
    description: 'Retrieve transactions. Default page size is 20.',
    type: Prisma.ModelName.Transaction,
    cursor: 'blockHash_requestKey',
    edgesNullable: false,
    args: {
      accountName: t.arg.string({
        required: false,
        validate: {
          minLength: 1,
        },
      }),
      fungibleName: t.arg.string({ required: false }),
      chainId: t.arg.string({
        required: false,
        validate: {
          minLength: 1,
        },
      }),
      blockHash: t.arg.string({
        required: false,
        validate: {
          minLength: 1,
        },
      }),
      requestKey: t.arg.string({
        required: false,
        validate: {
          minLength: 1,
        },
      }),
      minimumDepth: t.arg.int({
        required: false,
        validate: {
          nonnegative: true,
        },
      }),
    },
    complexity: (args) => ({
      field: getDefaultConnectionComplexity({
        first: args.first,
        last: args.last,
      }),
    }),
    async totalCount(__parent, args) {
      try {
        return prismaClient.transaction.count({
          where: await generateTransactionFilter(args),
        });
      } catch (error) {
        throw normalizeError(error);
      }
    },

    async resolve(query, __parent, args) {
      try {
        let transactions: Transaction[] = [];
        let skip = 0;
        const take = query.take;

        while (transactions.length < take) {
          const remaining = take - transactions.length;
          const fetchedTransactions = await prismaClient.transaction.findMany({
            ...query,
            where: await generateTransactionFilter(args),
            orderBy: {
              height: 'desc',
            },
            take: remaining,
            skip,
          });

          if (fetchedTransactions.length === 0) {
            break;
          }

          if (args.minimumDepth) {
            const uniqueBlockHashes = [
              ...new Set(fetchedTransactions.map((t) => t.blockHash)),
            ];
            const confirmationDepths = await Promise.all(
              uniqueBlockHashes.map((blockHash) =>
                getConfirmationDepth(blockHash),
              ),
            );

            const blockHashToDepth: Record<string, number> =
              uniqueBlockHashes.reduce(
                (map: Record<string, number>, blockHash, index) => {
                  map[blockHash] = confirmationDepths[index];
                  return map;
                },
                {},
              );

            const filteredTransactions = fetchedTransactions.filter(
              (transaction) =>
                blockHashToDepth[transaction.blockHash] >=
                (args.minimumDepth as number),
            );

            transactions = [...transactions, ...filteredTransactions];
          } else {
            transactions = [...transactions, ...fetchedTransactions];
          }

          skip += remaining;
        }

        return transactions.slice(0, take);
      } catch (error) {
        throw normalizeError(error);
      }
    },
  }),
);
