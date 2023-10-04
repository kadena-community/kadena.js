import { prismaClient } from '../../db/prismaClient';
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
      resolve: async (parent) => {
        const chainAccounts: ChainModuleAccount[] = [];

        for (let i = 0; i < 20; i++) {
          try {
            const accountDetails = await accountDetailsLoader.load({
              moduleName: parent.moduleName,
              accountName: parent.accountName,
              chainId: i.toString(),
            });

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
          } catch (e) {
            // console.log(e);
          }
        }

        return chainAccounts;
      },
    }),
    totalBalance: t.field({
      type: 'Decimal',
      resolve: async (parent) => {
        let totalBalance = 0;

        for (let i = 0; i < 20; i++) {
          try {
            const accountDetails = await accountDetailsLoader.load({
              moduleName: parent.moduleName,
              accountName: parent.accountName,
              chainId: i.toString(),
            });

            totalBalance += accountDetails.balance;
          } catch (e) {
            // console.log(e);
          }
        }

        return totalBalance;
      },
    }),
    transactions: t.prismaConnection({
      type: 'Transaction',
      cursor: 'blockhash_requestkey',
      resolve: (query, parent) => {
        return prismaClient.transaction.findMany({
          where: {
            sender: parent.accountName,
            events: {
              some: {
                module: parent.moduleName,
              },
            },
          },
          orderBy: {
            height: 'desc',
          },
          ...query,
          take: query.take || 10,
        });
      },
    }),
    transfers: t.prismaConnection({
      type: 'Transfer',
      cursor: 'block_chainid_idx_modulehash_requestkey',
      resolve: async (query, parent) => {
        return prismaClient.transfer.findMany({
          where: {
            OR: [
              {
                from_acct: parent.accountName,
              },
              {
                to_acct: parent.accountName,
              },
            ],
          },
          orderBy: {
            height: 'desc',
          },
          ...query,
          take: query.take || 10,
        });
      },
    }),
  }),
});
