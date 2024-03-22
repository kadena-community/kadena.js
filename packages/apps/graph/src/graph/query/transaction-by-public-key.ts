import { prismaClient } from '@db/prisma-client';
import { Prisma } from '@prisma/client';
import { getDefaultConnectionComplexity } from '@services/complexity';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';

builder.queryField('transactionsByPublicKey', (t) =>
  t.prismaConnection({
    type: Prisma.ModelName.Transaction,
    description: 'Retrieve all transactions by a given public key.',
    args: {
      publicKey: t.arg.string({ required: true }),
    },
    complexity: (args) => ({
      field:
        getDefaultConnectionComplexity({
          first: args.first,
          last: args.last,
        }) * 2, // Times two because of the extra call to signers.
    }),
    cursor: 'blockHash_requestKey',
    async resolve(query, parent, args) {
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
        });
      } catch (error) {
        throw normalizeError(error);
      }
    },
  }),
);
