import { builder } from '../builder';

export default builder.node('Signer1', {
  description: 'A signer for a specific transaction.',
  id: { resolve: (parent) => parent.publicKey },

  fields: (t) => ({
    publicKey: t.exposeString('publicKey'),
    address: t.exposeString('address', {
      nullable: true,
      description: 'The signer for the gas.',
    }),
    scheme: t.exposeString('scheme', {
      nullable: true,
      description: 'The signature scheme that was used to sign.',
    }),
    // clist: t.exposeString('clist', {
    //   nullable: true,
    //   description:
    //     'List of capabilities associated with/installed by this signer.',
    // }),
    clist: t.field({
      type: ['CapabilitiesList'],
      resolve: (parent) => parent.clist,
    }),
  }),
});
