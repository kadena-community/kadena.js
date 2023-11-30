import { prismaClient } from '@db/prismaClient';
import { getChainModuleAccount } from '@services/account-service';
import { normalizeError } from '@utils/errors';
import { COMPLEXITY, PRISMA, builder } from '../builder';
import { accountDetailsLoader } from '../data-loaders/account-details';
import type { ChainModuleAccount } from '../types/graphql-types';
import { ChainModuleAccountName } from '../types/graphql-types';

export default builder.node(
  builder.objectRef<ChainModuleAccount>(ChainModuleAccountName),
  {
    id: {
      resolve(parent) {
        return `${ChainModuleAccountName}/${parent.chainId}/${parent.moduleName}/${parent.accountName}`;
      },
      // Do not use parse here since there is a bug in the pothos relay plugin which can cause incorrect results. Parse the ID directly in the loadOne function.
    },
    isTypeOf(source) {
      return (source as any).__typename === ChainModuleAccountName;
    },
    async loadOne(id) {
      try {
        const chainId = id.split('/')[1];
        const moduleName = id.split('/')[2];
        const accountName = id.split('/')[3];

        return getChainModuleAccount({
          chainId,
          moduleName,
          accountName,
        });
      } catch (error) {
        throw normalizeError(error);
      }
    },
    fields: (t) => ({
      chainId: t.exposeID('chainId'),
      accountName: t.exposeString('accountName'),
      moduleName: t.exposeString('moduleName'),
      guard: t.field({
        type: 'Guard',
        complexity: COMPLEXITY.FIELD.CHAINWEB_NODE,
        async resolve(parent) {
          try {
            const accountDetails = await accountDetailsLoader.load({
              moduleName: parent.moduleName,
              accountName: parent.accountName,
              chainId: parent.chainId,
            });

            return {
              keys: accountDetails.guard.keys,
              predicate: accountDetails.guard.pred,
            };
          } catch (error) {
            throw normalizeError(error);
          }
        },
      }),
      balance: t.exposeFloat('balance'),
      transactions: t.prismaConnection({
        type: 'Transaction',
        cursor: 'blockHash_requestKey',
        edgesNullable: false,
        complexity: (args) => ({
          field:
            COMPLEXITY.FIELD.PRISMA_WITH_RELATIONS *
            (args.first || args.last || PRISMA.DEFAULT_SIZE),
        }),
        async totalCount(parent) {
          return await prismaClient.transaction.count({
            where: {
              senderAccount: parent.accountName,
              events: {
                some: {
                  moduleName: parent.moduleName,
                },
              },
              chainId: parseInt(parent.chainId),
            },
          });
        },
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
        edgesNullable: false,
        cursor: 'blockHash_chainId_orderIndex_moduleHash_requestKey',
        complexity: (args) => ({
          field:
            COMPLEXITY.FIELD.PRISMA_WITHOUT_RELATIONS *
            (args.first || args.last || PRISMA.DEFAULT_SIZE),
        }),
        async totalCount(parent) {
          try {
            return await prismaClient.transfer.count({
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
            });
          } catch (error) {
            throw normalizeError(error);
          }
        },
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
  },
);
