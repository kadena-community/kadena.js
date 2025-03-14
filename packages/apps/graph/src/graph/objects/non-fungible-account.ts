import { prismaClient } from '@db/prisma-client';
import { Prisma } from '@prisma/client';
import { getNonFungibleChainAccount } from '@services/account-service';
import {
  COMPLEXITY,
  getDefaultConnectionComplexity,
} from '@services/complexity';
import { dotenv } from '@utils/dotenv';
import { normalizeError } from '@utils/errors';
import { isDefined } from '@utils/isDefined';
import { builder } from '../builder';
import { nonFungibleChainCheck } from '../data-loaders/non-fungible-chain-check';
import { tokenDetailsLoader } from '../data-loaders/token-details';
import type { INonFungibleAccount } from '../types/graphql-types';
import {
  NonFungibleAccountName,
  NonFungibleChainAccountName,
} from '../types/graphql-types';
import Token from './non-fungible-token-balance';

export default builder.node(
  builder.objectRef<INonFungibleAccount>(NonFungibleAccountName),
  {
    description: 'A non-fungible-specific account.',
    id: {
      resolve: (parent) => parent.accountName,
      parse: (id) => id,
    },
    isTypeOf(source) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (source as any).__typename === NonFungibleAccountName;
    },
    async loadOne(accountName) {
      try {
        return {
          __typename: NonFungibleAccountName,
          accountName,
          chainAccounts: [],
          nonFungibleTokenBalances: [],
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
        complexity: {
          field:
            COMPLEXITY.FIELD.CHAINWEB_NODE +
            COMPLEXITY.FIELD.PRISMA_WITHOUT_RELATIONS,
        },
        async resolve(parent) {
          try {
            const chainIds = await nonFungibleChainCheck.load({
              accountName: parent.accountName,
            });

            return (
              await Promise.all(
                chainIds.map(async (chainId) => {
                  return getNonFungibleChainAccount({
                    chainId,
                    accountName: parent.accountName,
                  });
                }),
              )
            ).filter(isDefined);
          } catch (error) {
            throw normalizeError(error);
          }
        },
      }),
      nonFungibleTokenBalances: t.field({
        type: [Token],
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
        description: `Default page size is ${dotenv.DEFAULT_PAGE_SIZE}. Note that custom token related transactions are not included.`,
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
                events: {
                  some: {
                    moduleName: { startsWith: 'marmalade' },
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
                    moduleName: { startsWith: 'marmalade-v2' },
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
