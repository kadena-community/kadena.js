import { prismaClient } from '@db/prisma-client';
import { getDefaultConnectionComplexity } from '@services/complexity';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import { prismaTransactionMapper } from '../mappers/transaction-mapper';
import Transaction from '../objects/transaction';

builder.queryField('transaction', (t) =>
  t.field({
    description:
      'Retrieve one transaction by its unique key. Throws an error if multiple transactions are found.',
    nullable: true,
    args: {
      blockHash: t.arg.string({ required: false }),
      requestKey: t.arg.string({ required: true }),
    },
    type: Transaction,
    complexity: getDefaultConnectionComplexity(),
    async resolve(__parent, args, context) {
      try {
        const prismaTransactions = await prismaClient.transaction.findMany({
          where: {
            requestKey: args.requestKey,
            ...(args.blockHash && { blockHash: args.blockHash }),
          },
        });

        if (!prismaTransactions) return null;

        if (prismaTransactions.length === 0) {
          return null;
        }

        if (prismaTransactions.length > 1) {
          throw new Error(
            `Multiple transactions found for requestKey: ${args.requestKey}`,
          );
        }

        return prismaTransactionMapper(prismaTransactions[0], context);
      } catch (error) {
        throw normalizeError(error);
      }
    },
  }),
);
