import { prismaClient } from '@db/prisma-client';
import { Prisma } from '@prisma/client';
import { getDefaultConnectionComplexity } from '@services/complexity';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';

builder.queryField('transfer', (t) =>
  t.prismaField({
    description: 'Retrieve one transfer by its unique key.',
    nullable: true,
    args: {
      blockHash: t.arg.string({ required: true }),
      chainId: t.arg.string({ required: true }),
      orderIndex: t.arg.int({ required: true }),
      moduleHash: t.arg.string({ required: true }),
      requestKey: t.arg.string({ required: true }),
    },
    type: Prisma.ModelName.Transfer,
    complexity: getDefaultConnectionComplexity(),
    async resolve(query, __parent, args) {
      try {
        return await prismaClient.transfer.findUnique({
          ...query,
          where: {
            blockHash_chainId_orderIndex_moduleHash_requestKey: {
              blockHash: args.blockHash,
              chainId: parseInt(args.chainId),
              orderIndex: args.orderIndex,
              moduleHash: args.moduleHash,
              requestKey: args.requestKey,
            },
          },
        });
      } catch (error) {
        throw normalizeError(error);
      }
    },
  }),
);

builder.queryField('transfers', (t) =>
  t.prismaConnection({
    description: 'Retrieve transfers. Default page size is 20.',
    edgesNullable: false,
    args: {
      accountName: t.arg.string({ required: false }),
      fungibleName: t.arg.string({ required: false }),
      chainId: t.arg.string({ required: false }),
    },
    type: Prisma.ModelName.Transfer,
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
  }),
);

function generateTransferFilter(args: {
  accountName?: string | null | undefined;
  fungibleName?: string | null | undefined;
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

  if (args.fungibleName) {
    whereFilter.moduleName = args.fungibleName;
  }

  if (args.chainId) {
    whereFilter.chainId = parseInt(args.chainId);
  }

  return whereFilter;
}
