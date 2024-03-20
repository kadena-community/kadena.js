import { builder } from '../builder';

export const TransactionEdge = builder.objectType('TransactionEdge', {
  fields: (t) => ({
    node: t.field({
      type: 'Transaction',
      resolve(parent) {
        return parent.node;
      },
    }),
    cursor: t.exposeString('cursor'),
  }),
});

export const TransactionPageInfo = builder.objectType('TransactionPageInfo', {
  fields: (t) => ({
    startCursor: t.exposeString('startCursor', { nullable: true }),
    endCursor: t.exposeString('endCursor', { nullable: true }),
    hasNextPage: t.exposeBoolean('hasNextPage'),
    hasPreviousPage: t.exposeBoolean('hasPreviousPage'),
  }),
});

export default builder.objectType('TransactionConnection', {
  fields: (t) => ({
    edges: t.field({
      type: [TransactionEdge],
      resolve(parent) {
        return parent.edges;
      },
    }),
    pageInfo: t.field({
      type: TransactionPageInfo,
      resolve(parent) {
        return parent.pageInfo;
      },
    }),
    totalCount: t.exposeInt('totalCount'),
  }),
});
