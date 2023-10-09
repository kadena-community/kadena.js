import { prismaClient } from '../../db/prismaClient';
import { builder } from '../builder';
import { accountDetailsLoader } from '../data-loaders/account-details';

export default builder.objectType('ChainModuleAccount', {
  fields: (t) => ({
    chainId: t.exposeID('chainId'),
    accountName: t.exposeString('accountName'),
    moduleName: t.exposeString('moduleName'),
    guard: t.field({
      type: 'Guard',
      resolve: async (parent, args) => {
        const accountDetails = await accountDetailsLoader.load({
          moduleName: parent.moduleName,
          accountName: parent.accountName,
          chainId: parent.chainId,
        });

        return {
          keys: accountDetails.guard.keys,
          predicate: accountDetails.guard.pred,
        };
      },
    }),
    balance: t.exposeFloat('balance'),
    transactions: t.prismaConnection({
      type: 'Transaction',
      cursor: 'blockhash_requestkey',
      resolve: (query, parent) => {
        return prismaClient.transaction.findMany({
          ...query,
          where: {
            sender: parent.accountName,
            events: {
              some: {
                module: parent.moduleName,
              },
            },
            chainid: parseInt(parent.chainId),
          },
        });
      },
    }),
    transfers: t.prismaConnection({
      type: 'Transfer',
      cursor: 'block_chainid_idx_modulehash_requestkey',
      resolve: async (query, parent) => {
        return prismaClient.transfer.findMany({
          ...query,
          where: {
            OR: [
              {
                from_acct: parent.accountName,
              },
              {
                to_acct: parent.accountName,
              },
            ],
            modulename: parent.moduleName,
            chainid: parseInt(parent.chainId),
          },
        });
      },
    }),
  }),
});
