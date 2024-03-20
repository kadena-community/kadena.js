import { prismaClient } from '@db/prisma-client';
import { Prisma } from '@prisma/client';
import { getDefaultConnectionComplexity } from '@services/complexity';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';

builder.queryField('transaction', (t) =>
  t.prismaField({
    description: 'Retrieve one transaction by its unique key.',
    nullable: true,
    args: {
      blockHash: t.arg.string({ required: true }),
      requestKey: t.arg.string({ required: true }),
    },
    type: Prisma.ModelName.Transaction,
    complexity: getDefaultConnectionComplexity(),
    async resolve(query, __parent, args) {
      try {
        return await prismaClient.transaction.findUnique({
          ...query,
          where: {
            blockHash_requestKey: {
              blockHash: args.blockHash,
              requestKey: args.requestKey,
            },
          },
        });
      } catch (error) {
        throw normalizeError(error);
      }
    },
  }),
);
