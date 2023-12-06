import { prismaClient } from '@db/prismaClient';
import { getDefaultConnectionComplexity } from '@services/complexity';
import { builder } from '../builder';

builder.queryField('transactionsByPublicKey', (t) =>
  t.prismaConnection({
    description: 'Find all transactions by a given public key.',
    edgesNullable: false,
    args: {
      publicKey: t.arg.string({ required: true }),
    },
    type: 'Transaction',
    cursor: 'blockHash_requestKey',
    complexity: (args) => ({
      field:
        getDefaultConnectionComplexity({
          first: args.first,
          last: args.last,
        }) * 2, // Times two because of the exra call to signers.
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
    },
  }),
);
