import { builder } from '../builder';

export default builder.objectType('CapabilitiesList', {
  description: 'List of capabilities associated with/installed by this signer.',
  fields: (t) => ({
    name: t.exposeString('name'),
    args: t.exposeString('args'),
  }),
});
