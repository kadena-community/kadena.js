import { prismaClient } from '@db/prisma-client';
import { Prisma } from '@prisma/client';
import { getFungibleChainAccount } from '@services/account-service';
import {
  COMPLEXITY,
  getDefaultConnectionComplexity,
} from '@services/complexity';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import { fungibleAccountDetailsLoader } from '../data-loaders/fungible-account-details';
import type { IFungibleChainAccount } from '../types/graphql-types';
import { FungibleChainAccountName } from '../types/graphql-types';
import { bigintSortFn } from '../../utils/bigintSortFn';
import Guard from './guard';

export default builder.node(
  builder.objectRef<IFungibleChainAccount>(FungibleChainAccountName),
  {
    description: 'A fungible specific chain-account.',
    id: {
      resolve: (parent) =>
        JSON.stringify([
          parent.chainId,
          parent.fungibleName,
          parent.accountName,
        ]),
      parse: (id) => ({
        chainId: JSON.parse(id)[0],
        fungibleName: JSON.parse(id)[1],
        accountName: JSON.parse(id)[2],
      }),
    },
    isTypeOf(source) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (source as any).__typename === FungibleChainAccountName;
    },
    async loadOne({ chainId, fungibleName, accountName }) {
      try {
        return await getFungibleChainAccount({
          chainId,
          fungibleName,
          accountName,
        });
      } catch (error) {
        throw normalizeError(error);
      }
    },
    fields: (t) => ({
      chainId: t.exposeString('chainId'),
      accountName: t.exposeString('accountName'),
      fungibleName: t.exposeString('fungibleName'),
      guard: t.field({
        type: Guard,
        complexity: COMPLEXITY.FIELD.CHAINWEB_NODE,
        async resolve(parent) {
          try {
            const accountDetails = await fungibleAccountDetailsLoader.load({
              fungibleName: parent.fungibleName,
              accountName: parent.accountName,
              chainId: parent.chainId,
            });

            return {
              keys: accountDetails!.guard.keys,
              predicate: accountDetails!.guard.pred,
            };
          } catch (error) {
            throw normalizeError(error);
          }
        },
      }),
      balance: t.exposeFloat('balance'),
      transactions: t.prismaConnection({
        description:
          'Transactions that the current account is sender of. Default page size is 20.',
        type: Prisma.ModelName.Transaction,
        cursor: 'blockHash_requestKey',
        edgesNullable: false,
        complexity: (args) => ({
          field: getDefaultConnectionComplexity({
            withRelations: true,
            first: args.first,
            last: args.last,
          }),
        }),
        async totalCount(parent) {
          return await prismaClient.transaction.count({
            where: {
              senderAccount: parent.accountName,
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
        description: 'Default page size is 20.',
        type: Prisma.ModelName.Transfer,
        edgesNullable: false,
        cursor: 'blockHash_chainId_orderIndex_moduleHash_requestKey',
        complexity: (args) => ({
          field: getDefaultConnectionComplexity({
            first: args.first,
            last: args.last,
          }),
        }),
        async totalCount(parent) {
          try {
            return (
              await Promise.all([
                await prismaClient.transfer.count({
                  where: {
                    senderAccount: parent.accountName,
                    // NOT: {
                    //   receiverAccount: parent.accountName,
                    // },
                    moduleName: parent.fungibleName,
                    chainId: parseInt(parent.chainId),
                  },
                }),
                await prismaClient.transfer.count({
                  where: {
                    receiverAccount: parent.accountName,
                    // NOT: {
                    //   senderAccount: parent.accountName,
                    // },
                    moduleName: parent.fungibleName,
                    chainId: parseInt(parent.chainId),
                  },
                }),
              ])
            ).reduce((acc, count) => acc + count, 0);
          } catch (error) {
            throw normalizeError(error);
          }
        },
        async resolve(condition, parent) {
          try {
            return (
              await Promise.all([
                await prismaClient.transfer.findMany({
                  ...condition,
                  where: {
                    receiverAccount: parent.accountName,
                    NOT: {
                      receiverAccount: parent.accountName,
                    },
                    moduleName: parent.fungibleName,
                    chainId: parseInt(parent.chainId),
                  },
                  orderBy: {
                    height: 'desc',
                  },
                }),

                await prismaClient.transfer.findMany({
                  ...condition,
                  where: {
                    receiverAccount: parent.accountName,
                    NOT: {
                      senderAccount: parent.accountName,
                    },
                    moduleName: parent.fungibleName,
                    chainId: parseInt(parent.chainId),
                  },
                  orderBy: {
                    height: 'desc',
                  },
                }),
              ])
            )
              .reduce((acc, transfers) => acc.concat(transfers), [])
              .sort((a, b) => bigintSortFn(a.height, b.height))
              .slice(condition.skip, condition.skip + condition.take);
          } catch (error) {
            throw normalizeError(error);
          }
        },
      }),
    }),
  },
);
