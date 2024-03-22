import { prismaClient } from '@db/prisma-client';
import { Prisma } from '@prisma/client';
import { COMPLEXITY } from '@services/complexity';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import { tokenDetailsLoader } from '../data-loaders/token-details';
import type { NonFungibleChainAccount } from '../types/graphql-types';
import { NonFungibleChainAccountName } from '../types/graphql-types';
import Token from './token';

export default builder.node(
  builder.objectRef<NonFungibleChainAccount>(NonFungibleChainAccountName),
  {
    description: 'A chain and non-fungible-specific account.',
    id: {
      resolve: (parent) => JSON.stringify([parent.chainId, parent.accountName]),
      parse: (id) => ({
        chainId: JSON.parse(id)[0],
        accountName: JSON.parse(id)[1],
      }),
    },
    isTypeOf(source) {
      return (source as any).__typename === NonFungibleChainAccountName;
    },
    async loadOne({ chainId, accountName }) {
      try {
        return {
          __typename: NonFungibleChainAccountName,
          chainId,
          accountName,
          nonFungibles: [],
          transactions: [],
        };
      } catch (error) {
        throw normalizeError(error);
      }
    },
    fields: (t) => ({
      chainId: t.exposeID('chainId'),
      accountName: t.exposeString('accountName'),
      nonFungibles: t.field({
        type: [Token],
        complexity: COMPLEXITY.FIELD.PRISMA_WITHOUT_RELATIONS,
        async resolve(parent) {
          try {
            const tokenDetails = await tokenDetailsLoader.load({
              accountName: parent.accountName,
              chainId: parent.chainId,
            });

            return tokenDetails;
          } catch (error) {
            throw normalizeError(error);
          }
        },
      }),
      transactions: t.prismaConnection({
        type: Prisma.ModelName.Transaction,
        edgesNullable: false,
        description: 'Default page size is 20.',
        cursor: 'blockHash_requestKey',
        async totalCount(parent) {
          try {
            return prismaClient.transaction.count({
              where: {
                senderAccount: parent.accountName,
                events: {
                  some: {
                    moduleName: 'marmalade-v2.ledger',
                  },
                },
                chainId: parseInt(parent.chainId),
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
                events: {
                  some: {
                    moduleName: 'marmalade-v2.ledger',
                  },
                },
                chainId: parseInt(parent.chainId),
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
