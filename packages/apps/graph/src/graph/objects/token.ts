import { builder } from '../builder';

export default builder.objectType('Token', {
  description: 'The token identifier and its balance.',
  fields: (t) => ({
    id: t.exposeID('id'),
    balance: t.exposeInt('balance'),
    chainId: t.exposeInt('chainId'),
  }),
});
