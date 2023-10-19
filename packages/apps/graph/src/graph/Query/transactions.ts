import { Prisma } from '@prisma/client';
import { prismaClient } from '../../db/prismaClient';
import { builder } from '../builder';

builder.queryField('transactions', (t) => {
  return t.prismaConnection({
    args: {
      accountName: t.arg.string({ required: false }),
      moduleName: t.arg.string({ required: false }),
      chainId: t.arg.string({ required: false }),
      blockHash: t.arg.string({ required: false }),
    },
    type: 'Transaction',
    cursor: 'blockHash_requestKey',

    totalCount(parent, args, context, info) {
      return prismaClient.transaction.count({
        where: generateTransactionFilter(args),
      });
    },

    resolve: (query, parent, args) => {
      const whereFilter = generateTransactionFilter(args);

      return prismaClient.transaction.findMany({
        ...query,
        where: {
          ...whereFilter,
        },
        orderBy: {
          height: 'desc',
        },
      });
    },
  });
});

function generateTransactionFilter(args: {
  accountName?: string | null | undefined;
  moduleName?: string | null | undefined;
  chainId?: string | null | undefined;
  blockHash?: string | null | undefined;
}): Prisma.TransactionWhereInput {
  const whereFilter: Prisma.TransactionWhereInput = {};

  if (args.accountName) {
    whereFilter.senderAccount = args.accountName;
  }

  if (args.moduleName) {
    if (whereFilter.events) {
      whereFilter.events.some = { moduleName: args.moduleName };
    } else {
      whereFilter.events = { some: { moduleName: args.moduleName } };
    }
  }

  if (args.chainId) {
    whereFilter.chainId = parseInt(args.chainId);
  }

  if (args.blockHash) {
    whereFilter.blockHash = args.blockHash;
  }

  return whereFilter;
}
