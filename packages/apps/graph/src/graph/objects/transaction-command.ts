import { builder } from '../builder';
import Signer from './signer';
import Meta from './transaction-meta';
import Payload from './transaction-payload';

export default builder.objectType('TransactionCommand', {
  description: 'A transaction command.',
  fields: (t) => ({
    payload: t.field({
      type: Payload,
      resolve(parent) {
        return parent.payload;
      },
    }),
    meta: t.field({
      type: Meta,
      resolve(parent) {
        return parent.meta;
      },
    }),

    signers: t.field({
      type: [Signer],
      resolve: (parent) => parent.signers,
    }),

    networkId: t.exposeString('networkId', {
      description: 'The network id of the environment.',
    }),
    nonce: t.exposeString('nonce'),
  }),
});
