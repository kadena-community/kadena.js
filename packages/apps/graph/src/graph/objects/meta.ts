import { builder } from '../builder';

builder.objectType('Meta', {
  description: 'The metadata of a transaction.',
  fields: (t) => ({
    sender: t.exposeString('sender'),
    chainId: t.exposeString('chainId'),
    gasLimit: t.expose('gasLimit', { type: 'BigInt' }),
    gasPrice: t.expose('gasPrice', { type: 'Float' }),
    ttl: t.expose('ttl', { type: 'BigInt' }),
    creationTime: t.expose('creationTime', { type: 'DateTime' }),
  }),
});
