import { prismaClient } from '@db/prisma-client';
import type { Prisma } from '@prisma/client';
import { getDefaultConnectionComplexity } from '@services/complexity';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import Transaction from '../objects/transaction';
import { resolveTransactionConnection } from '../resolvers/transaction-connection';

builder.queryField('transactionsByPublicKey', (t) =>
  t.connection({
    type: Transaction,
    description: 'Retrieve all transactions by a given public key.',
    edgesNullable: false,
    complexity: (args) => ({
      field:
        getDefaultConnectionComplexity({
          first: args.first,
          last: args.last,
        }) * 2, // Times two because of the extra call to signers.
    }),
    args: {
      publicKey: t.arg.string({ required: true }),
    },
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
