import { builder } from '../builder';

export default builder.objectType('NonFungibleTokenPolicy', {
  description: 'A policy that defines the rules for a non-fungible token.',
  fields: (t) => ({
    moduleName: t.exposeString('moduleName'),
  }),
});
