import { prismaClient } from '@db/prismaClient';
import type { Prisma } from '@prisma/client';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';

builder.queryField('transfers', (t) => {
  return t.prismaConnection({
    args: {
      accountName: t.arg.string({ required: false }),
      moduleName: t.arg.string({ required: false }),
      chainId: t.arg.string({ required: false }),
    },
    type: 'Transfer',
    cursor: 'blockHash_chainId_orderIndex_moduleHash_requestKey',
    async totalCount(__parent, args) {
      try {
        return await prismaClient.transfer.count({
          where: geerateTransferFilter(args),
        });
      } catch (error) {
        throw normalizeError(error);
      }
    },
    async resolve(query, __parent, args) {
      try {
        const whereFilter = geerateTransferFilter(args);

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

function geerateTransferFilter(args: {
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
