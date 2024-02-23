import { builder } from '../builder';

export default builder.objectType('TransactionResult', {
  description: 'The result of a transaction.',
  fields: (t) => ({
    badResult: t.exposeString('badResult'),
    continuation: t.exposeString('continuation'),
    gas: t.expose('gas', { type: 'BigInt' }),
    goodResult: t.exposeString('goodResult'),
    height: t.expose('height', { type: 'BigInt' }),
    logs: t.exposeString('logs', { nullable: true }),
    metadata: t.exposeString('metadata'),
    eventCount: t.expose('eventCount', { type: 'BigInt', nullable: true }),
    transactionId: t.expose('transactionId', {
      type: 'BigInt',
      nullable: true,
    }),
  }),
});
