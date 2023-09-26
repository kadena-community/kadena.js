import { prismaClient } from '../../db/prismaClient';
import { IChainModuleAccount, builder } from '../builder';
import { getAccountDetails } from '../../services/node-service';

export default builder.objectType('ModuleAccount', {
  fields: (t) => ({
    id: t.exposeString('id'),
    accountName: t.exposeString('accountName'),
    moduleName: t.exposeString('moduleName'),
    chainAccounts: t.field({
      type: ['ChainModuleAccount'],
      resolve: async (parent) => {
        const chainAccounts: IChainModuleAccount[] = [];

        for (let i = 0; i < 20; i++) {
          const accountDetails = await getAccountDetails(
            parent.moduleName,
            parent.accountName,
            i.toString(),
          );

          if (accountDetails) {
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
        }

        return chainAccounts;
      },
    }),
    totalBalance: t.field({
      type: 'Decimal',
      resolve: async (parent) => {
        let totalBalance = 0;

        for (let i = 0; i < 20; i++) {
          const accountDetails = await getAccountDetails(
            parent.moduleName,
            parent.accountName,
            i.toString(),
          );

          if (accountDetails) {
            totalBalance += accountDetails.balance;
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
            }
          },
          orderBy: {
            height: 'desc',
          },
          take: 10,
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
          take: 10,
        });
      },
    }),
  }),
});
