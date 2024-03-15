import { builder } from '../builder';

export default builder.objectType('TransactionMeta', {
  description: 'The metadata of a transaction.',
  fields: (t) => ({
    sender: t.exposeString('sender'),
    chainId: t.expose('chainId', { type: 'BigInt' }),
    gasLimit: t.expose('gasLimit', { type: 'BigInt' }),
    gasPrice: t.expose('gasPrice', { type: 'Float' }),
    ttl: t.expose('ttl', { type: 'BigInt' }),
    creationTime: t.expose('creationTime', { type: 'DateTime' }),
  }),
});
