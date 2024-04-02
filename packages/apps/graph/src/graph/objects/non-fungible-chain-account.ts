import { prismaClient } from '@db/prisma-client';
import { Prisma } from '@prisma/client';
import {
  COMPLEXITY,
  getDefaultConnectionComplexity,
} from '@services/complexity';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import { tokenDetailsLoader } from '../data-loaders/token-details';
import type { NonFungibleChainAccount } from '../types/graphql-types';
import { NonFungibleChainAccountName } from '../types/graphql-types';
import NonFungibleTokenBalance from './non-fungible-token-balance';

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
        type: [NonFungibleTokenBalance],
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
          return await prismaClient.transaction.count({
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
