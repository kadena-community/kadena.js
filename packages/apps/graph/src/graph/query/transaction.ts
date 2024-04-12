import { prismaClient } from '@db/prisma-client';
import { Prisma } from '@prisma/client';
import { getDefaultConnectionComplexity } from '@services/complexity';
import {
  getConditionForMinimumDepth,
  getConfirmationDepth,
} from '@services/depth-service';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';

builder.queryField('transaction', (t) =>
  t.prismaField({
    description:
      'Retrieve one transaction by its unique key. Throws an error if multiple transactions are found.',
    nullable: true,
    args: {
      blockHash: t.arg.string({
        required: false,
        validate: {
          minLength: 1,
        },
      }),
      requestKey: t.arg.string({
        required: true,
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
    type: Prisma.ModelName.Transaction,
    complexity: getDefaultConnectionComplexity(),
    async resolve(query, __parent, args) {
      try {
        const transactions = await prismaClient.transaction.findMany({
          ...query,
          where: {
            requestKey: args.requestKey,
            ...(args.blockHash && { blockHash: args.blockHash }),
            ...(args.minimumDepth && {
              OR: await getConditionForMinimumDepth(args.minimumDepth),
            }),
          },
        });

        if (!transactions || transactions.length === 0) return null;

        let filteredTransactions = transactions;

        if (args.minimumDepth) {
          const confirmationDepths = await Promise.all(
            transactions.map((transaction) =>
              getConfirmationDepth(transaction.blockHash),
            ),
          );

          filteredTransactions = transactions.filter(
            (_, index) =>
              confirmationDepths[index] >= (args.minimumDepth as number),
          );

          if (filteredTransactions.length === 0) return null;
        }

        if (filteredTransactions.length > 1) {
          throw new Error(
            `Multiple transactions found for requestKey: ${args.requestKey}`,
          );
        }

        return filteredTransactions[0];
      } catch (error) {
        throw normalizeError(error);
      }
    },
  }),
);
