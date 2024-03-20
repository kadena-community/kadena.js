import { prismaClient } from '@db/prisma-client';
import type { Prisma } from '@prisma/client';
import { getDefaultConnectionComplexity } from '@services/complexity';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import TransactionConnection from '../objects/transaction-connection';
import { resolveTransactionConnection } from '../resolvers/transaction-connection';

builder.queryField('transactionsByPublicKey', (t) =>
  t.field({
    type: TransactionConnection,
    description: 'Retrieve all transactions by a given public key.',
    args: {
      publicKey: t.arg.string({ required: true }),
      first: t.arg.int({ required: false }),
      last: t.arg.int({ required: false }),
      before: t.arg.string({ required: false }),
      after: t.arg.string({ required: false }),
    },
    complexity: (args) => ({
      field:
        getDefaultConnectionComplexity({
          first: args.first,
          last: args.last,
        }) * 2, // Times two because of the extra call to signers.
    }),

    async resolve(__parent, args, context) {
      try {
        const requestKeys = await prismaClient.signer.findMany({
          where: {
            publicKey: args.publicKey,
          },
          select: {
            requestKey: true,
          },
        });

        const whereCondition: Prisma.TransactionWhereInput = {
          requestKey: {
            in: requestKeys.map((value) => value.requestKey),
          },
        };

        return resolveTransactionConnection(args, context, whereCondition);
      } catch (error) {
        throw normalizeError(error);
      }
    },
  }),
);
