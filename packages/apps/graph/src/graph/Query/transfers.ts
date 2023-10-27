import { prismaClient } from '../../db/prismaClient';
import { builder } from '../builder';

builder.queryField('transfers', (t) => {
  return t.prismaConnection({
    args: {
      accountName: t.arg.string({ required: true }),
      moduleName: t.arg.string({ required: true }),
      chainId: t.arg.string({ required: false }),
    },
    type: 'Transfer',
    cursor: 'blockHash_chainId_orderIndex_moduleHash_requestKey',
    resolve: async (query, parent, args) => {
      return prismaClient.transfer.findMany({
        ...query,
        where: {
          OR: [
            {
              senderAccount: args.accountName,
            },
            {
              receiverAccount: args.accountName,
            },
          ],
          moduleName: args.moduleName,
          ...(args.chainId && { chainId: parseInt(args.chainId) }),
        },
        orderBy: {
          height: 'desc',
        },
      });
    },
  });
});
