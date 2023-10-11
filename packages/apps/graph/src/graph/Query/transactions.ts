import { prismaClient } from '../../db/prismaClient';
import { builder } from '../builder';

builder.queryField('transactions', (t) => {
  return t.prismaConnection({
    args: {
      accountName: t.arg.string({ required: true }),
      moduleName: t.arg.string({ required: true }),
      chainId: t.arg.string({ required: false }),
    },
    type: 'Transaction',
    cursor: 'blockHash_requestKey',
    resolve: (query, parent, args) => {
      return prismaClient.transaction.findMany({
        ...query,
        where: {
          sender: args.accountName,
          events: {
            some: {
              moduleName: args.moduleName,
            },
          },
          ...(args.chainId && { chainId: parseInt(args.chainId) }),
        },
      });
    },
  });
});
