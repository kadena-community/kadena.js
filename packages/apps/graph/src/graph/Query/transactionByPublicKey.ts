import { prismaClient } from '../../db/prismaClient';
import { builder } from '../builder';

builder.queryField('transactionsByPublicKey', (t) => {
  return t.prismaConnection({
    args: {
      publicKey: t.arg.string({ required: true }),
    },
    type: 'Transaction',
    cursor: 'blockHash_requestKey',

    resolve: async (query, parent, args) => {
      const requestKeys = await prismaClient.signer.findMany({
        where: {
          publicKey: args.publicKey,
        },
        select: {
          requestKey: true,
        },
      });

      return prismaClient.transaction.findMany({
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
  });
});
