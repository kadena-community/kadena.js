import { builder } from '../builder';

const MempoolInfo = builder.objectType('MempoolInfo', {
  description: 'The mempool information.',
  fields: (t) => ({
    status: t.exposeString('status', {
      description: 'The status of the mempool.',
      nullable: true,
    }),
  }),
});

const TransactionInfo = builder.objectType('TransactionInfo', {
  description: 'The result of a transaction.',
  fields: (t) => ({
    badResult: t.exposeString('badResult', {
      description:
        'The transaction result when it was successful. Formatted as raw JSON.',
      nullable: true,
    }),
    continuation: t.exposeString('continuation', {
      description:
        'The JSON stringified continuation in the case that it is a continuation.',
      nullable: true,
    }),
    gas: t.expose('gas', { type: 'BigInt' }),
    goodResult: t.exposeString('goodResult', {
      description:
        'The transaction result when it was successful. Formatted as raw JSON.',
      nullable: true,
    }),
    height: t.expose('height', {
      description: 'The height of the block this transaction belongs to.',
      type: 'BigInt',
    }),
    logs: t.exposeString('logs', {
      description:
        'Identifier to retrieve the logs for the execution of the transaction.',
      nullable: true,
    }),
    metadata: t.exposeString('metadata', { nullable: true }),
    eventCount: t.expose('eventCount', { type: 'BigInt', nullable: true }),
    transactionId: t.expose('transactionId', {
      type: 'BigInt',
      nullable: true,
    }),
  }),
});

export default builder.unionType('TransactionResult', {
  description: 'The result of a transaction.',
  types: [TransactionInfo, MempoolInfo],
  resolveType(result) {
    if ('status' in result) {
      return 'MempoolInfo';
    } else {
      return 'TransactionInfo';
    }
  },
});
