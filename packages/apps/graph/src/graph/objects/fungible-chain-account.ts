import { prismaClient } from '@db/prisma-client';
import { Prisma } from '@prisma/client';
import { getFungibleChainAccount } from '@services/account-service';
import {
  COMPLEXITY,
  getDefaultConnectionComplexity,
} from '@services/complexity';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import { accountDetailsLoader } from '../data-loaders/account-details';
import type { FungibleChainAccount } from '../types/graphql-types';
import { FungibleChainAccountName } from '../types/graphql-types';
import Guard from './guard';

export default builder.node(
  builder.objectRef<FungibleChainAccount>(FungibleChainAccountName),
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
      return (source as any).__typename === FungibleChainAccountName;
    },
    async loadOne({ chainId, fungibleName, accountName }) {
      try {
        return getFungibleChainAccount({
          chainId,
          fungibleName,
          accountName,
        });
      } catch (error) {
        throw normalizeError(error);
      }
    },
    fields: (t) => ({
      chainId: t.exposeID('chainId'),
      accountName: t.exposeString('accountName'),
      fungibleName: t.exposeString('fungibleName'),
      guard: t.field({
        type: Guard,
        complexity: COMPLEXITY.FIELD.CHAINWEB_NODE,
        async resolve(parent) {
          try {
            const accountDetails = await accountDetailsLoader.load({
              fungibleName: parent.fungibleName,
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
        type: Prisma.ModelName.Transaction,
        description: 'Default page size is 20.',
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
              events: {
                some: {
                  moduleName: parent.fungibleName,
                },
              },
              chainId: parseInt(parent.chainId),
            },
          });
        },

        async resolve(query, parent) {
          return await prismaClient.transaction.findMany({
            ...query,
            where: {
              senderAccount: parent.accountName,
              events: {
                some: {
                  moduleName: parent.fungibleName,
                },
              },
              chainId: parseInt(parent.chainId),
            },
          });
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
                moduleName: parent.fungibleName,
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
                moduleName: parent.fungibleName,
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
