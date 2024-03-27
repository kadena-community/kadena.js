import { prismaClient } from '@db/prisma-client';
import { Prisma } from '@prisma/client';
import { getDefaultConnectionComplexity } from '@services/complexity';
import { normalizeError } from '@utils/errors';
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

builder.queryField('transactions', (t) =>
  t.prismaConnection({
    description: 'Retrieve transactions. Default page size is 20.',
    type: Prisma.ModelName.Transaction,
    cursor: 'blockHash_requestKey',
    edgesNullable: false,
    args: {
      accountName: t.arg.string({
        required: false,
        validate: {
          minLength: 1,
        },
      }),
      fungibleName: t.arg.string({ required: false }),
      chainId: t.arg.string({
        required: false,
        validate: {
          minLength: 1,
        },
      }),
      blockHash: t.arg.string({
        required: false,
        validate: {
          minLength: 1,
        },
      }),
      requestKey: t.arg.string({
        required: false,
        validate: {
          minLength: 1,
        },
      }),
    },
    complexity: (args) => ({
      field: getDefaultConnectionComplexity({
        first: args.first,
        last: args.last,
      }),
    }),
    async totalCount(__parent, args) {
      try {
        return prismaClient.transaction.count({
          where: generateTransactionFilter(args),
        });
      } catch (error) {
        throw normalizeError(error);
      }
    },

    async resolve(query, __parent, args) {
      try {
        return prismaClient.transaction.findMany({
          ...query,
          where: generateTransactionFilter(args),
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
