import { builder } from '../builder';

export default builder.node('Signer', {
  description: 'A signer for a specific transaction.',
  id: {
    resolve: (parent) => JSON.stringify([parent.requestKey, parent.orderIndex]),
  },

  fields: (t) => ({
    requestKey: t.exposeString('requestKey'),
    orderIndex: t.exposeInt('orderIndex'),
    publicKey: t.exposeString('publicKey'),
    address: t.exposeString('address', {
      nullable: true,
      description: 'The signer for the gas.',
    }),
    scheme: t.exposeString('scheme', {
      nullable: true,
      description: 'The signature scheme that was used to sign.',
    }),
    clist: t.field({
      type: ['CapabilitiesList'],
      resolve: (parent) => parent.clist,
    }),
  }),
});
