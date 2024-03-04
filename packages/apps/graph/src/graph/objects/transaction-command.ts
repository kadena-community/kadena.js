import { builder } from '../builder';
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
      type: 'TransactionMeta',
      resolve(parent) {
        return parent.meta;
      },
    }),

    signers: t.prismaField({
      type: ['Signer'],
      nullable: true,
      resolve(__query, parent) {
        return parent.signers;
      },
    }),

    networkId: t.exposeString('networkId', {
      description: 'The network id of the environment.',
    }),
    nonce: t.exposeString('nonce'),
  }),
});
