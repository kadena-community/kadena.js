import { prismaClient } from '@db/prisma-client';
import { getDefaultConnectionComplexity } from '@services/complexity';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import { prismaTransactionMapper } from '../mappers/transaction-mapper';
import Transaction from '../objects/transaction';

builder.queryField('transaction', (t) =>
  t.field({
    description: 'Retrieve a completed transaction by its unique key.',
    nullable: true,
    args: {
      blockHash: t.arg.string({ required: true }),
      requestKey: t.arg.string({ required: true }),
    },
    type: Transaction,
    complexity: getDefaultConnectionComplexity(),
    async resolve(__parent, args, context) {
      try {
        const prismaTransactiom = await prismaClient.transaction.findUnique({
          where: {
            blockHash_requestKey: {
              blockHash: args.blockHash,
              requestKey: args.requestKey,
            },
          },
          include: {
            block: true,
            events: true,
          },
        });

        if (!prismaTransactiom) return null;

        return prismaTransactionMapper(prismaTransactiom, context);
      } catch (error) {
        throw normalizeError(error);
      }
    },
  }),
);
