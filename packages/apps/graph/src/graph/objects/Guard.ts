import { builder } from '../builder';

export default builder.objectType('Guard', {
  description: 'Guard for an account.',
  fields: (t) => ({
    keys: t.exposeStringList('keys'),
    predicate: t.exposeString('predicate'),
  }),
});
