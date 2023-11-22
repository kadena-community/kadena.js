import { prismaClient } from '@db/prismaClient';
import { getChainModuleAccount } from '@services/account-service';
import { chainIds } from '@utils/chains';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import { accountDetailsLoader } from '../data-loaders/account-details';
import type { ChainModuleAccount, ModuleAccount } from '../types/graphql-types';
import {
  ChainModuleAccountName,
  ModuleAccountName,
} from '../types/graphql-types';

export default builder.node(
  builder.objectRef<ModuleAccount>(ModuleAccountName),
  {
    id: {
      resolve(parent) {
        return `${ModuleAccountName}/${parent.moduleName}/${parent.accountName}`;
      },
      // Do not use parse here since there is a bug in the pothos relay plugin which can cause incorrect results. Parse the ID directly in the loadOne function.
    },
    isTypeOf(source) {
      return (source as any).__typename === ModuleAccountName;
    },
    async loadOne(id) {
      try {
        const moduleName = id.split('/')[1];
        const accountName = id.split('/')[2];

        return {
          __typename: ModuleAccountName,
          accountName,
          moduleName,
          chainAccounts: [],
          totalBalance: 0,
          transactions: [],
          transfers: [],
        };
      } catch (error) {
        throw normalizeError(error);
      }
    },
    fields: (t) => ({
      accountName: t.exposeString('accountName'),
      moduleName: t.exposeString('moduleName'),
      chainAccounts: t.field({
        type: [ChainModuleAccountName],
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
        edgesNullable: false,
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
        edgesNullable: false,
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
  },
);
