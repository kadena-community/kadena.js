import { prismaClient } from '@db/prisma-client';
import { Prisma } from '@prisma/client';
import { getFungibleChainAccount } from '@services/account-service';
import {
  COMPLEXITY,
  getDefaultConnectionComplexity,
} from '@services/complexity';
import { normalizeError } from '@utils/errors';
import { networkData } from '@utils/network';
import { builder } from '../builder';
import { fungibleAccountDetailsLoader } from '../data-loaders/fungible-account-details';
import type {
  IFungibleAccount,
  IFungibleChainAccount,
} from '../types/graphql-types';
import {
  FungibleAccountName,
  FungibleChainAccountName,
} from '../types/graphql-types';

export default builder.node(
  builder.objectRef<IFungibleAccount>(FungibleAccountName),
  {
    description: 'A fungible-specific account.',
    id: {
      resolve: (parent) =>
        JSON.stringify([parent.fungibleName, parent.accountName]),
      parse: (id) => ({
        fungibleName: JSON.parse(id)[0],
        accountName: JSON.parse(id)[1],
      }),
    },
    isTypeOf(source) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (source as any).__typename === FungibleAccountName;
    },

    async loadOne({ fungibleName, accountName }) {
      try {
        return {
          __typename: FungibleAccountName,
          accountName,
          fungibleName,
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
      fungibleName: t.exposeString('fungibleName'),
      chainAccounts: t.field({
        type: [FungibleChainAccountName],
        complexity: {
          field: COMPLEXITY.FIELD.CHAINWEB_NODE,
        },

        async resolve(parent) {
          try {
            return (
              await Promise.all(
                networkData.chainIds.map((chainId) => {
                  return getFungibleChainAccount({
                    chainId,
                    fungibleName: parent.fungibleName,
                    accountName: parent.accountName,
                  });
                }),
              )
            ).filter(
              (chainAccount) => chainAccount !== null,
            ) as IFungibleChainAccount[];
          } catch (error) {
            throw normalizeError(error);
          }
        },
      }),
      totalBalance: t.field({
        type: 'Decimal',
        complexity: {
          field: COMPLEXITY.FIELD.CHAINWEB_NODE,
        },

        async resolve(parent) {
          try {
            return (
              await Promise.all(
                networkData.chainIds.map(async (chainId) => {
                  return fungibleAccountDetailsLoader.load({
                    fungibleName: parent.fungibleName,
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
        description: 'Default page size is 20.',
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
          try {
            return await prismaClient.transaction.count({
              where: {
                senderAccount: parent.accountName,
              },
            });
          } catch (error) {
            throw normalizeError(error);
          }
        },

        async resolve(query, parent) {
          try {
            return await prismaClient.transaction.findMany({
              ...query,
              where: {
                senderAccount: parent.accountName,
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
        cursor: 'blockHash_chainId_orderIndex_moduleHash_requestKey',
        edgesNullable: false,
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
                    NOT: {
                      receiverAccount: parent.accountName,
                    },
                    moduleName: parent.fungibleName,
                  },
                }),
                await prismaClient.transfer.count({
                  where: {
                    receiverAccount: parent.accountName,
                    NOT: {
                      senderAccount: parent.accountName,
                    },
                    moduleName: parent.fungibleName,
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

/**
 * Split the query into multiple queries based on the amount of OR conditions.
 * Merge the results and return the total count.
 */
export async function prismaCountOr(query: any, parent: any, ors: any[]) {
  const result = await Promise.all(
    ors.map((condition) => query({ ...parent, where: condition })),
  );
  return result.reduce((acc, count) => acc + count, 0);
}

/**
 * Split the query into multiple queries based on the amount of OR conditions.
 * Merge the results
 */
export async function prismaFindManyOr(query: any, parent: any, ors: any[]) {
  const result = await Promise.all(
    ors.map((condition) => query({ ...parent, where: condition })),
  );
  return result.flat();
}

export function bigintSortFn(a: bigint, b: bigint): number {
  if (a > b) {
    return 1;
  } else if (a < b) {
    return -1;
  } else {
    return 0;
  }
}
