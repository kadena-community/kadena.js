import { builder } from '../builder';

export default builder.objectType('TransactionResult', {
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
