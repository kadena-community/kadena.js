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
    cursor: 'block_chainid_idx_modulehash_requestkey',
    resolve: async (query, parent, args) => {
      return prismaClient.transfer.findMany({
        ...query,
        where: {
          OR: [
            {
              from_acct: args.accountName,
            },
            {
              to_acct: args.accountName,
            },
          ],
          modulename: args.moduleName,
          ...(args.chainId && { chainid: parseInt(args.chainId) }),
        },
      });
    },
  });
});
