import { prismaClient } from '@db/prismaClient';
import { getChainModuleAccount } from '@services/account-service';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import { accountDetailsLoader } from '../data-loaders/account-details';
import { ChainModuleAccount } from '../types/graphql-types';

export default builder.node(
  builder.objectRef<ChainModuleAccount>('ChainModuleAccount'),
  {
    id: {
      resolve(parent, __args, __context, info) {
        return `${info.parentType}/${parent.chainId}/${parent.moduleName}/${parent.accountName}`;
      },
      parse(id) {
        return {
          chainId: id.split('/')[1],
          accountName: id.split('/')[3],
          moduleName: id.split('/')[2],
        };
      },
    },
    isTypeOf: () => true,
    async loadOne(id) {
      try {
        return getChainModuleAccount({
          chainId: id.chainId,
          moduleName: id.moduleName,
          accountName: id.accountName,
        });
      } catch (error) {
        throw normalizeError(error);
      }
    },
    async loadMany(ids) {
      try {
        return await Promise.all(
          ids.map(async (id) => {
            return await getChainModuleAccount({
              chainId: id.chainId,
              moduleName: id.moduleName,
              accountName: id.accountName,
            });
          }),
        );
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
  },
);
