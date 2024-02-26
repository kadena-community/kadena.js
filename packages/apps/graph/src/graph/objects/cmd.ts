import { builder } from '../builder';
import Payload from './payload';

export default builder.objectType('Cmd', {
  description: 'A transaction cmd.',
  fields: (t) => ({
    payload: t.field({
      type: Payload,
      resolve(parent) {
        return parent.payload;
      },
    }),
    meta: t.field({
      type: 'Meta',
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
