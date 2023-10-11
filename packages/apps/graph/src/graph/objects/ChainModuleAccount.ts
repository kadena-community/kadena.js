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
      cursor: 'blockHash_requestKey',
      resolve: (query, parent) => {
        return prismaClient.transaction.findMany({
          ...query,
          where: {
            senderAccount: parent.accountName,
            events: {
              some: {
                moduleName: parent.moduleName,
              },
            },
            chainId: parseInt(parent.chainId),
          },
          orderBy: {
            height: 'desc',
          },
        });
      },
    }),
    transfers: t.prismaConnection({
      type: 'Transfer',
      cursor: 'block_chainId_orderIndex_moduleHash_requestKey',
      resolve: async (query, parent) => {
        return prismaClient.transfer.findMany({
          ...query,
          where: {
            OR: [
              {
                senderAccount: parent.accountName,
              },
              {
                receiverAccount: parent.accountName,
              },
            ],
            moduleName: parent.moduleName,
            chainId: parseInt(parent.chainId),
          },
          orderBy: {
            height: 'desc',
          },
        });
      },
    }),
  }),
});
