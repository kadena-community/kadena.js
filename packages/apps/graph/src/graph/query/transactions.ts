import { prismaClient } from '@db/prisma-client';
import { Prisma } from '@prisma/client';
import { getDefaultConnectionComplexity } from '@services/complexity';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';

builder.queryField('transactions', (t) =>
  t.prismaConnection({
    description: 'Retrieve transactions. Default page size is 20.',
    edgesNullable: false,
    args: {
      accountName: t.arg.string({ required: false }),
      fungibleName: t.arg.string({ required: false }),
      chainId: t.arg.string({ required: false }),
      blockHash: t.arg.string({ required: false }),
      requestKey: t.arg.string({ required: false }),
    },
    type: Prisma.ModelName.Transaction,
    cursor: 'blockHash_requestKey',
    complexity: (args) => ({
      field: getDefaultConnectionComplexity({
        withRelations: !!args.fungibleName,
        first: args.first,
        last: args.last,
      }),
    }),
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
  }),
);

function generateTransactionFilter(args: {
  accountName?: string | null | undefined;
  fungibleName?: string | null | undefined;
  chainId?: string | null | undefined;
  blockHash?: string | null | undefined;
  requestKey?: string | null | undefined;
}): Prisma.TransactionWhereInput {
  const whereFilter: Prisma.TransactionWhereInput = {};

  if (args.accountName) {
    whereFilter.senderAccount = args.accountName;
  }

  if (args.fungibleName) {
    if (whereFilter.events) {
      whereFilter.events.some = { moduleName: args.fungibleName };
    } else {
      whereFilter.events = { some: { moduleName: args.fungibleName } };
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
