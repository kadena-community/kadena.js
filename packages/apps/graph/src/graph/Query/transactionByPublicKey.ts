import { prismaClient } from '@db/prismaClient';
import { COMPLEXITY, PRISMA, builder } from '../builder';

builder.queryField('transactionsByPublicKey', (t) => {
  return t.prismaConnection({
    edgesNullable: false,
    args: {
      publicKey: t.arg.string({ required: true }),
    },
    type: 'Transaction',
    cursor: 'blockHash_requestKey',
    complexity: (args) => ({
      field:
        COMPLEXITY.FIELD.PRISMA_WITHOUT_RELATIONS *
        (args.first || args.last || PRISMA.DEFAULT_SIZE) *
        2, // Times two because of the exra call to signers.
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
  });
});
