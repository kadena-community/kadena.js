import { prismaClient } from '../../db/prismaClient';
import { builder } from '../builder';

export default builder.objectType('ChainAccount', {
  fields: (t) => ({
    chainId: t.exposeID('chainId'),
    // guard: t.field({
    //   type: 'Guard',
    //   resolve: async (parent, args) => {
    //     return {
    //       keys: ['1'],
    //       predicate: 'KeysAll',
    //     };
    //   },
    // }),
    balance: t.exposeFloat('balance'),
    module: t.exposeString('module'),
    // transactions: t.prismaConnection({
    //   type: 'Transaction',
    //   args: {
    //     accountName: t.arg.string({ required: true }),
    //   },
    //   cursor: 'blockHash_requestkey',
    //   resolve: (query, parent, args) => {
    //     return prismaClient.transaction.findMany({
    //       where: {
    //         sender: args.accountName,
    //       },
    //       orderBy: {
    //         height: 'desc',
    //       },
    //       take: 10,
    //     });
    //   },
    // }),
    transfers: t.prismaConnection({
      type: 'Transfer',
      args: {
        accountName: t.arg.string({ required: true }),
        modules: t.arg.stringList({ required: true }),
      },
      cursor: 'block_chainid_idx_modulehash_requestkey',
      resolve: async (query, parent, args) => {
        return prismaClient.transfer.findMany({
          where: {
            OR: [
              {
                from_acct: args.accountName,
              },
              {
                to_acct: args.accountName,
              },
            ],
            modulename: {
              in: args.modules,
            },
          },
          orderBy: {
            height: 'desc',
          },
          take: 10,
        });
      },
    }),
  }),
});
