import { prismaClient } from '@db/prisma-client';
import type { Transaction } from '@prisma/client';
import { Prisma } from '@prisma/client';
import { getDefaultConnectionComplexity } from '@services/complexity';
import {
  createBlockDepthMap,
  getConditionForMinimumDepth,
} from '@services/depth-service';
import { normalizeError } from '@utils/errors';
import { ZodError } from 'zod';
import { builder } from '../builder';

const generateTransactionFilter = async (args: {
  accountName?: string | null | undefined;
  fungibleName?: string | null | undefined;
  chainId?: string | null | undefined;
  blockHash?: string | null | undefined;
  requestKey?: string | null | undefined;
  minimumDepth?: number | null | undefined;
  minHeight?: number | null | undefined;
  maxHeight?: number | null | undefined;
}): Promise<Prisma.TransactionWhereInput> => {
  const conditionForBlockHeight = (args: {
    minHeight?: number | null | undefined;
    maxHeight?: number | null | undefined;
  }): Prisma.TransactionWhereInput => {
    const conditions: Prisma.TransactionWhereInput[] = [];

    if (args.minHeight) {
      conditions.push({ block: { height: { gte: args.minHeight } } });
    }

    if (args.maxHeight) {
      conditions.push({ block: { height: { lte: args.maxHeight } } });
    }

    return { AND: conditions };
  };

  return {
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
    ...(args.minHeight && { block: { height: { gte: args.minHeight } } }),
    ...((args.maxHeight || args.minHeight) && conditionForBlockHeight(args)),
  };
};

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
      minHeight: t.arg.int({
        required: false,
        validate: {
          nonnegative: true,
        },
      }),
      maxHeight: t.arg.int({
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
        minimumDepth: args.minimumDepth,
      }),
    }),
    async totalCount(__parent, args) {
      // at least one of these should be in the args
      // accountName && fungibleName
      // blockHash
      // requestKey
      if (
        stringNullOrEmpty(args.accountName) &&
        stringNullOrEmpty(args.fungibleName) &&
        stringNullOrEmpty(args.blockHash) &&
        stringNullOrEmpty(args.requestKey)
      ) {
        throw new ZodError([
          {
            code: 'custom',
            message:
              'At least one of accountName, fungibleName, blockHash, or requestKey must be provided',
            path: ['transactions'],
          },
        ]);
      }
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
        if (
          args.minHeight &&
          args.maxHeight &&
          args.minHeight > args.maxHeight
        ) {
          throw new ZodError([
            {
              code: 'custom',
              message: 'minHeight must be lower than maxHeight',
              path: ['transactions'],
            },
          ]);
        }
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
            const blockHashToDepth = await createBlockDepthMap(
              fetchedTransactions,
              'blockHash',
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

function stringNullOrEmpty(s: string | null | undefined): boolean {
  return s === null || s === undefined || s === '';
}
