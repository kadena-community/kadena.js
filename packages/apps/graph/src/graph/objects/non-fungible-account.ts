import type { Prisma } from '@prisma/client';
import { COMPLEXITY } from '@services/complexity';
import { dotenv } from '@utils/dotenv';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import { nonFungibleChainCheck } from '../data-loaders/non-fungible-chain-check';
import { tokenDetailsLoader } from '../data-loaders/token-details';
import { resolveTransactionConnection } from '../resolvers/transaction-connection';
import type { NonFungibleAccount } from '../types/graphql-types';
import {
  NonFungibleAccountName,
  NonFungibleChainAccountName,
} from '../types/graphql-types';
import Token from './token';
import Transaction from './transaction';

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
            const chainIds = await nonFungibleChainCheck.load({
              accountName: parent.accountName,
            });

            return chainIds.map((chainId) => {
              return {
                __typename: NonFungibleChainAccountName,
                chainId,
                accountName: parent.accountName,
                nonFungibles: [],
                transactions: [],
              };
            });
          } catch (error) {
            throw normalizeError(error);
          }
        },
      }),
      nonFungibles: t.field({
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
      transactions: t.connection({
        type: Transaction,
        description: 'Default page size is 20.',
        edgesNullable: false,
        resolve(parent, args, context) {
          try {
            const whereCondition: Prisma.TransactionWhereInput = {
              senderAccount: parent.accountName,
              events: {
                some: {
                  moduleName: 'marmalade-v2.ledger',
                },
              },
            };

            return resolveTransactionConnection(args, context, whereCondition);
          } catch (error) {
            throw normalizeError(error);
          }
        },
      }),
    }),
  },
);
