import { prismaClient } from '@src/db/prismaClient';
import { normalizeError } from '@src/utils/errors';
import { builder } from '../builder';
import { accountDetailsLoader } from '../data-loaders/account-details';

export default builder.objectType('ChainModuleAccount', {
  fields: (t) => ({
    chainId: t.exposeID('chainId'),
    accountName: t.exposeString('accountName'),
    moduleName: t.exposeString('moduleName'),
    guard: t.field({
      type: 'Guard',
      async resolve(parent) {
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
      async resolve(query, parent) {
        try {
          return await prismaClient.transaction.findMany({
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
        } catch (error) {
          throw normalizeError(error);
        }
      },
    }),
    transfers: t.prismaConnection({
      type: 'Transfer',
      cursor: 'blockHash_chainId_orderIndex_moduleHash_requestKey',
      async resolve(query, parent) {
        try {
          return await prismaClient.transfer.findMany({
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
        } catch (error) {
          throw normalizeError(error);
        }
      },
    }),
  }),
});
