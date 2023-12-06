import { prismaClient } from '@db/prismaClient';
import type { Prisma } from '@prisma/client';
import {
  COMPLEXITY,
  getDefaultConnectionComplexity,
} from '@services/complexity';
import { normalizeError } from '@utils/errors';
import { PRISMA, builder } from '../builder';

builder.queryField('transfers', (t) => {
  return t.prismaConnection({
    edgesNullable: false,
    args: {
      accountName: t.arg.string({ required: false }),
      moduleName: t.arg.string({ required: false }),
      chainId: t.arg.string({ required: false }),
    },
    type: 'Transfer',
    cursor: 'blockHash_chainId_orderIndex_moduleHash_requestKey',
    complexity: (args) => ({
      field: getDefaultConnectionComplexity({
        first: args.first,
        last: args.last,
      }),
    }),
    async totalCount(__parent, args) {
      try {
        return await prismaClient.transfer.count({
          where: generateTransferFilter(args),
        });
      } catch (error) {
        throw normalizeError(error);
      }
    },
    async resolve(query, __parent, args) {
      try {
        const whereFilter = generateTransferFilter(args);

        return await prismaClient.transfer.findMany({
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

function generateTransferFilter(args: {
  accountName?: string | null | undefined;
  moduleName?: string | null | undefined;
  chainId?: string | null | undefined;
}): Prisma.TransferWhereInput {
  const whereFilter: Prisma.TransferWhereInput = {};

  if (args.accountName) {
    whereFilter.OR = [
      {
        senderAccount: args.accountName,
      },
      {
        receiverAccount: args.accountName,
      },
    ];
  }

  if (args.moduleName) {
    whereFilter.moduleName = args.moduleName;
  }

  if (args.chainId) {
    whereFilter.chainId = parseInt(args.chainId);
  }

  return whereFilter;
}
