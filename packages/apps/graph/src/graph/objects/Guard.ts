import { builder } from '../builder';

export default builder.objectType('Guard', {
  description: 'Access rule for a certain smart contract or account.',
  fields: (t) => ({
    keys: t.exposeStringList('keys'),
    predicate: t.exposeString('predicate'),
  }),
});
