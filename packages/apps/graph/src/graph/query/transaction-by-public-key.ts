import { prismaClient } from '@db/prisma-client';
import { Prisma } from '@prisma/client';
import { getDefaultConnectionComplexity } from '@services/complexity';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';

builder.queryField('transactionsByPublicKey', (t) =>
  t.prismaConnection({
    description: 'Retrieve all transactions by a given public key.',
    args: {
      publicKey: t.arg.string({ required: true }),
    },
    type: Prisma.ModelName.Transaction,
    cursor: 'blockHash_requestKey',
    complexity: (args) => ({
      field:
        getDefaultConnectionComplexity({
          first: args.first,
          last: args.last,
        }) * 2, // Times two because of the extra call to signers.
    }),
    async totalCount(__parent, args) {
      const requestKeys = await prismaClient.signer.findMany({
        where: {
          publicKey: args.publicKey,
        },
        select: {
          requestKey: true,
        },
      });

      return await prismaClient.transaction.count({
        where: {
          requestKey: {
            in: requestKeys.map((value) => value.requestKey),
          },
        },
      });
    },
    async resolve(query, __parent, args) {
      try {
        const requestKeys = await prismaClient.signer.findMany({
          where: {
            publicKey: args.publicKey,
          },
          select: {
            requestKey: true,
          },
        });

        return prismaClient.transaction.findMany({
          ...query,
          where: {
            requestKey: {
              in: requestKeys.map((value) => value.requestKey),
            },
          },
          orderBy: {
            height: 'desc',
          },
        });
      } catch (error) {
        throw normalizeError(error);
      }
    },
  }),
);
