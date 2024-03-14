import { builder } from '../builder';
import Payload from './transaction-payload';

export default builder.objectType('TransactionCommand1', {
  description: 'A transaction command.',
  fields: (t) => ({
    payload: t.field({
      type: Payload,
      resolve(parent) {
        return parent.payload;
      },
    }),
    meta: t.field({
      type: 'TransactionMeta',
      resolve(parent) {
        return parent.meta;
      },
    }),

    signers: t.field({
      type: ['Signer1'],
      resolve: (parent) => parent.signers,
    }),

    networkId: t.exposeString('networkId', {
      description: 'The network id of the environment.',
    }),
    nonce: t.exposeString('nonce'),
  }),
});
