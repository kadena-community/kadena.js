import { prismaClient } from '@db/prisma-client';
import { Prisma } from '@prisma/client';
import { getNonFungibleChainAccount } from '@services/account-service';
import {
  COMPLEXITY,
  getDefaultConnectionComplexity,
} from '@services/complexity';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import { nonFungibleAccountDetailsLoader } from '../data-loaders/non-fungible-account-details';
import { tokenDetailsLoader } from '../data-loaders/token-details';
import type { NonFungibleChainAccount } from '../types/graphql-types';
import { NonFungibleChainAccountName } from '../types/graphql-types';
import Guard from './guard';
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
        return await getNonFungibleChainAccount({
          chainId,
          accountName,
        });
      } catch (error) {
        throw normalizeError(error);
      }
    },
    fields: (t) => ({
      chainId: t.exposeID('chainId'),
      accountName: t.exposeString('accountName'),
      guard: t.field({
        type: Guard,
        complexity: COMPLEXITY.FIELD.CHAINWEB_NODE,
        async resolve(parent) {
          try {
            const tokenDetails = await tokenDetailsLoader.load({
              accountName: parent.accountName,
              chainId: parent.chainId,
            });

            const accountDetails = await nonFungibleAccountDetailsLoader.load({
              tokenId: tokenDetails[0].id,
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
      nonFungibleTokenBalances: t.field({
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
        description:
          'Default page size is 20. Note that custom token related transactions are not included.',
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
                  moduleName: { startsWith: 'marmalade-v2' },
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
                    moduleName: { startsWith: 'marmalade-v2' },
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
