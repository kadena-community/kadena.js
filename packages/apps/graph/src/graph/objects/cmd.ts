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
      nullable: true,
      resolve(parent) {
        return parent.meta;
      },
    }),

    networkId: t.exposeString('networkId'),
    nonce: t.exposeString('nonce'),
  }),
});
