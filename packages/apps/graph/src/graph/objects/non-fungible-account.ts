import { prismaClient } from '@db/prisma-client';
import { getNonFungibleChainAccount } from '@services/account-service';
import {
  COMPLEXITY,
  getDefaultConnectionComplexity,
} from '@services/complexity';
import { chainIds } from '@utils/chains';
import { dotenv } from '@utils/dotenv';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import { tokenDetailsLoader } from '../data-loaders/token-details';
import type {
  NonFungibleAccount,
  NonFungibleChainAccount,
} from '../types/graphql-types';
import {
  NonFungibleAccountName,
  NonFungibleChainAccountName,
} from '../types/graphql-types';

export default builder.node(
  builder.objectRef<NonFungibleAccount>(NonFungibleAccountName),
  {
    description: 'A non-fungible-specific account.',
    id: {
      resolve: (parent) => parent.accountName,
      parse: (id) => id,
    },
    isTypeOf(source) {
      return (source as any).__typename === NonFungibleAccountName;
    },
    async loadOne(accountName) {
      try {
        return {
          __typename: NonFungibleAccountName,
          accountName,
          chainAccounts: [],
          transactions: [],
        };
      } catch (error) {
        throw normalizeError(error);
      }
    },
    fields: (t) => ({
      accountName: t.exposeString('accountName'),
      chainAccounts: t.field({
        type: [NonFungibleChainAccountName],
        complexity:
          (COMPLEXITY.FIELD.CHAINWEB_NODE +
            COMPLEXITY.FIELD.PRISMA_WITHOUT_RELATIONS) *
          dotenv.CHAIN_COUNT,
        async resolve(parent) {
          try {
            return (
              await Promise.all(
                chainIds.map((chainId) => {
                  return getNonFungibleChainAccount({
                    chainId: chainId,
                    accountName: parent.accountName,
                  });
                }),
              )
            ).filter(
              (chainAccount) => chainAccount !== null,
            ) as NonFungibleChainAccount[];
          } catch (error) {
            throw normalizeError(error);
          }
        },
      }),
      nonFungibles: t.field({
        type: ['Token'],
        complexity: COMPLEXITY.FIELD.PRISMA_WITHOUT_RELATIONS,
        async resolve(parent) {
          try {
            const tokenDetails = await tokenDetailsLoader.load({
              accountName: parent.accountName,
            });

            return tokenDetails;
          } catch (error) {
            throw normalizeError(error);
          }
        },
      }),

      transactions: t.prismaConnection({
        type: 'Transaction',
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
                events: {
                  some: {
                    moduleName: 'marmalade-v2.ledger',
                  },
                },
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
