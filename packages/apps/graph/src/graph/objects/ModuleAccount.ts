import { prismaClient } from '@db/prismaClient';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import { accountDetailsLoader } from '../data-loaders/account-details';
import type { ChainModuleAccount } from '../types/graphql-types';

export default builder.objectType('ModuleAccount', {
  fields: (t) => ({
    id: t.exposeString('id'),
    accountName: t.exposeString('accountName'),
    moduleName: t.exposeString('moduleName'),
    chainAccounts: t.field({
      type: ['ChainModuleAccount'],
      async resolve(parent) {
        const chainAccounts: ChainModuleAccount[] = [];

        for (let i = 0; i < 20; i++) {
          try {
            const accountDetails = await accountDetailsLoader.load({
              moduleName: parent.moduleName,
              accountName: parent.accountName,
              chainId: i.toString(),
            });

            if (accountDetails !== null) {
              chainAccounts.push({
                chainId: i.toString(),
                accountName: parent.accountName,
                moduleName: parent.moduleName,
                guard: {
                  keys: accountDetails.guard.keys,
                  predicate: accountDetails.guard.pred,
                },
                balance: accountDetails.balance,
                transactions: [],
                transfers: [],
              });
            }
          } catch (error) {
            throw normalizeError(error);
          }
        }

        return chainAccounts;
      },
    }),
    totalBalance: t.field({
      type: 'Decimal',
      async resolve(parent) {
        let totalBalance = 0;

        for (let i = 0; i < 20; i++) {
          try {
            const accountDetails = await accountDetailsLoader.load({
              moduleName: parent.moduleName,
              accountName: parent.accountName,
              chainId: i.toString(),
            });

            if (accountDetails !== null) {
              totalBalance += accountDetails.balance;
            }
          } catch (error) {
            throw normalizeError(error);
          }
        }

        return totalBalance;
      },
    }),
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
