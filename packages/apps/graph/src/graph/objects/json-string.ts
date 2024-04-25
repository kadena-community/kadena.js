import { builder } from '../builder';

export default builder.objectType('JsonString', {
  description: 'A JSON string.',
  fields: (t) => ({
    type: t.exposeString('type'),
    value: t.exposeString('value'),
  }),
});
