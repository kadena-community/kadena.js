import type { Prisma } from '@prisma/client';
import { COMPLEXITY } from '@services/complexity';
import { normalizeError } from '@utils/errors';
import { builder } from '../builder';
import { tokenDetailsLoader } from '../data-loaders/token-details';
import { resolveTransactionConnection } from '../resolvers/transaction-connection';
import type { NonFungibleChainAccount } from '../types/graphql-types';
import { NonFungibleChainAccountName } from '../types/graphql-types';
import Token from './token';
import TransactionConnection from './transaction-connection';

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
      transactions: t.field({
        type: TransactionConnection,
        description: 'Default page size is 20.',
        args: {
          first: t.arg.int({ required: false }),
          last: t.arg.int({ required: false }),
          before: t.arg.string({ required: false }),
          after: t.arg.string({ required: false }),
        },
        resolve(parent, args, context) {
          try {
            const whereCondition: Prisma.TransactionWhereInput = {
              senderAccount: parent.accountName,
              chainId: parseInt(parent.chainId),
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
