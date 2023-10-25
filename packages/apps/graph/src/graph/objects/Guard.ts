import { builder } from '../builder';

export default builder.objectType('Guard', {
  fields: (t) => ({
    keys: t.exposeStringList('keys'),
    predicate: t.exposeString('predicate'),
  }),
});
