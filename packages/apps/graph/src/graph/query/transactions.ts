import { prismaClient } from '@db/prisma-client';
import { Prisma } from '@prisma/client';
import { getDefaultConnectionComplexity } from '@services/complexity';
import { builder } from '../builder';

const generateTransactionFilter = (args: {
  accountName?: string | null | undefined;
  fungibleName?: string | null | undefined;
  chainId?: string | null | undefined;
  blockHash?: string | null | undefined;
  requestKey?: string | null | undefined;
}): Prisma.TransactionWhereInput => ({
  ...(args.accountName && { senderAccount: args.accountName }),
  ...(args.fungibleName && {
    events: {
      some: {
        moduleName: args.fungibleName,
      },
    },
  }),
  ...(args.chainId && { chainId: parseInt(args.chainId) }),
  ...(args.blockHash && { blockHash: args.blockHash }),
  ...(args.requestKey && { requestKey: args.requestKey }),
});

builder.queryField('transactions1', (t) =>
  t.prismaConnection({
    description: 'Retrieve transactions. Default page size is 20.',
    type: Prisma.ModelName.Transaction,
    edgesNullable: false,
    complexity: (args) => ({
      field: getDefaultConnectionComplexity({
        first: args.first,
        last: args.last,
      }),
    }),
    cursor: 'blockHash_requestKey',
    args: {
      accountName: t.arg.string({ required: false }),
      fungibleName: t.arg.string({ required: false }),
      chainId: t.arg.string({ required: false }),
      blockHash: t.arg.string({ required: false }),
      requestKey: t.arg.string({ required: false }),
    },
    async totalCount(parent, args, context) {
      return prismaClient.transaction.count({
        where: generateTransactionFilter(args),
      });
    },

    async resolve(query, parent, args, context) {
      return prismaClient.transaction.findMany({
        ...query,
        where: generateTransactionFilter(args),
      });
    },
  }),
);
