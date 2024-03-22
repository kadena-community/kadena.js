import { prismaClient } from '@db/prisma-client';
import { Prisma } from '@prisma/client';
import { getDefaultConnectionComplexity } from '@services/complexity';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';

const generateTransferFilter = (args: {
  accountName?: string | null | undefined;
  fungibleName?: string | null | undefined;
  chainId?: string | null | undefined;
  requestKey?: string | null | undefined;
  blockHash?: string | null | undefined;
}): Prisma.TransferWhereInput => ({
  ...(args.accountName && {
    OR: [
      { senderAccount: args.accountName },
      { receiverAccount: args.accountName },
    ],
  }),
  ...(args.fungibleName && { moduleName: args.fungibleName }),
  ...(args.chainId && { chainId: parseInt(args.chainId) }),
  ...(args.requestKey && { requestKey: args.requestKey }),
  ...(args.blockHash && { blockHash: args.blockHash }),
});

builder.queryField('transfers', (t) =>
  t.prismaConnection({
    description: 'Retrieve transfers. Default page size is 20.',
    edgesNullable: false,
    args: {
      accountName: t.arg.string({ required: false }),
      fungibleName: t.arg.string({ required: false }),
      chainId: t.arg.string({ required: false }),
      requestKey: t.arg.string({ required: false }),
      blockHash: t.arg.string({ required: false }),
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
        return await prismaClient.transfer.findMany({
          ...query,
          where: generateTransferFilter(args),
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
