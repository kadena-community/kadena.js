import { prismaClient } from '@db/prismaClient';
import type { Prisma } from '@prisma/client';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';

builder.queryField('transactions', (t) => {
  return t.prismaConnection({
    args: {
      accountName: t.arg.string({ required: false }),
      moduleName: t.arg.string({ required: false }),
      chainId: t.arg.string({ required: false }),
      blockHash: t.arg.string({ required: false }),
      requestKey: t.arg.string({ required: false }),
    },
    type: 'Transaction',
    cursor: 'blockHash_requestKey',
    async totalCount(__parent, args) {
      try {
        return await prismaClient.transaction.count({
          where: generateTransactionFilter(args),
        });
      } catch (error) {
        throw normalizeError(error);
      }
    },
    async resolve(query, __parent, args) {
      try {
        const whereFilter = generateTransactionFilter(args);

        return await prismaClient.transaction.findMany({
          ...query,
          where: {
            ...whereFilter,
          },
          orderBy: {
            height: 'desc',
          },
        });
      } catch (error) {
        throw normalizeError(error);
      }
    },
  });
});

function generateTransactionFilter(args: {
  accountName?: string | null | undefined;
  moduleName?: string | null | undefined;
  chainId?: string | null | undefined;
  blockHash?: string | null | undefined;
  requestKey?: string | null | undefined;
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

  if (args.requestKey) {
    whereFilter.requestKey = args.requestKey;
  }

  return whereFilter;
}
