import { builder } from '../builder';
import { TransactionStatus } from '../types/graphql-types';
import GQLTransaction from './transaction';

export const GQLTransactionSubscriptionStatus = builder.enumType(
  'TransactionStatus',
  {
    description: 'The status of the transaction.',
    values: Object.keys(
      TransactionStatus,
    ) as (keyof typeof TransactionStatus)[],
  },
);

export const GQLTransactionSubscriptionResponse = builder.objectType(
  'TransactionSubscriptionResponse',
  {
    description: 'The response for a transaction subscription.',
    fields: (t) => ({
      status: t.field({
        description: 'The status of the transaction.',
        type: GQLTransactionSubscriptionStatus,
        resolve: (parent) => parent.status,
      }),
      transaction: t.field({
        description: 'The transaction.',
        type: GQLTransaction,
        nullable: true,
        resolve: (parent) => parent.transaction,
      }),
    }),
  },
);
