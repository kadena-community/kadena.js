import { prismaClient } from '@db/prismaClient';
import { getChainModuleAccount } from '@services/account-service';
import { chainIds } from '@utils/chains';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import { accountDetailsLoader } from '../data-loaders/account-details';
import type { ChainModuleAccount, ModuleAccount } from '../types/graphql-types';

export default builder.node(builder.objectRef<ModuleAccount>('ModuleAccount'), {
  id: {
    resolve(parent) {
      return `ModuleAccount/${parent.moduleName}/${parent.accountName}`;
    },
    parse(id) {
      return {
        moduleName: id.split('/')[1],
        accountName: id.split('/')[2],
      };
    },
  },
  isTypeOf: () => true,
  async loadOne({ moduleName, accountName }) {
    // const chainAccounts = (
    //   await Promise.all(
    //     chainIds.map(async (chainId) => {
    //       return await getChainModuleAccount({
    //         chainId: chainId,
    //         moduleName,
    //         accountName,
    //       });
    //     }),
    //   )
    // ).filter((chainAccount) => chainAccount !== null) as ChainModuleAccount[];

    // const totalBalance = (
    //   await Promise.all(
    //     chainIds.map(async (chainId) => {
    //       return accountDetailsLoader.load({
    //         moduleName,
    //         accountName,
    //         chainId: chainId,
    //       });
    //     }),
    //   )
    // ).reduce((acc, accountDetails) => {
    //   if (accountDetails !== null) {
    //     return acc + accountDetails.balance;
    //   }
    //   return acc;
    // }, 0);

    return {
      accountName: '',
      moduleName: '',
      chainAccounts: [],
      totalBalance: 0,
      transactions: [],
      transfers: [],
    };
  },
  fields: (t) => ({
    accountName: t.exposeString('accountName'),
    moduleName: t.exposeString('moduleName'),
    chainAccounts: t.field({
      type: ['ChainModuleAccount'],
      async resolve(parent) {
        try {
          return (
            await Promise.all(
              chainIds.map(async (chainId) => {
                return await getChainModuleAccount({
                  chainId: chainId,
                  moduleName: parent.moduleName,
                  accountName: parent.accountName,
                });
              }),
            )
          ).filter(
            (chainAccount) => chainAccount !== null,
          ) as ChainModuleAccount[];
        } catch (error) {
          throw normalizeError(error);
        }
      },
    }),
    totalBalance: t.field({
      type: 'Decimal',
      async resolve(parent) {
        try {
          return (
            await Promise.all(
              chainIds.map(async (chainId) => {
                return accountDetailsLoader.load({
                  moduleName: parent.moduleName,
                  accountName: parent.accountName,
                  chainId: chainId,
                });
              }),
            )
          ).reduce((acc, accountDetails) => {
            if (accountDetails !== null) {
              return acc + accountDetails.balance;
            }
            return acc;
          }, 0);
        } catch (error) {
          throw normalizeError(error);
        }
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
