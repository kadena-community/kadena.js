import { prismaClient } from '@db/prisma-client';
import { Prisma } from '@prisma/client';
import { getDefaultConnectionComplexity } from '@services/complexity';
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
    },
    type: Prisma.ModelName.Transaction,
    complexity: getDefaultConnectionComplexity(),
    async resolve(query, __parent, args) {
      try {
        const result = await prismaClient.transaction.findMany({
          ...query,
          where: {
            requestKey: args.requestKey,
            ...(args.blockHash && { blockHash: args.blockHash }),
          },
        });

        if (!result) return null;

        if (result.length === 0) {
          return null;
        }

        if (result.length > 1) {
          throw new Error(
            `Multiple transactions found for requestKey: ${args.requestKey}`,
          );
        }

        return result[0];
      } catch (error) {
        throw normalizeError(error);
      }
    },
  }),
);
