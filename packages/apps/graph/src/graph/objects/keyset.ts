import { builder } from '../builder';

export default builder.objectType('Keyset', {
  description: 'Guard for an account.',
  fields: (t) => ({
    keys: t.exposeStringList('keys'),
    predicate: t.exposeString('predicate'),
  }),
});
