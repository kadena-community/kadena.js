import { builder } from '../builder';
import Policy from './policy';

export default builder.objectType('NonFungibleTokenInfo', {
  description: 'Information related to a token.',
  fields: (t) => ({
    supply: t.exposeInt('supply'),
    precision: t.exposeInt('precision'),
    uri: t.exposeString('uri'),
    policies: t.field({
      type: [Policy],
      resolve: (parent) => parent.policies,
    }),
  }),
});
