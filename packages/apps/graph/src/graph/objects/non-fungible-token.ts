import { builder } from '../builder';
import NonFungibleTokenPolicy from './non-fungible-token-policy';

export default builder.objectType('NonFungibleToken', {
  description: 'Information related to a token.',
  fields: (t) => ({
    supply: t.exposeInt('supply'),
    precision: t.exposeInt('precision'),
    uri: t.exposeString('uri'),
    policies: t.field({
      type: [NonFungibleTokenPolicy],
      resolve: (parent) => parent.policies,
    }),
  }),
});
