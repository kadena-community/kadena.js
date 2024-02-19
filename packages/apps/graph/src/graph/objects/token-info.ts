import { builder } from '../builder';

export default builder.objectType('TokenInfo', {
  description: 'Information related to a token.',
  fields: (t) => ({
    supply: t.exposeInt('supply'),
    precision: t.exposeInt('precision'),
    uri: t.exposeString('uri'),
  }),
});
