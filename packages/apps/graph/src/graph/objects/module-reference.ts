import { builder } from '../builder';

export default builder.objectType('ModuleReference', {
  description: 'A reference to a module.',
  fields: (t) => ({
    name: t.exposeString('name'),
    namespace: t.exposeString('namespace'),
  }),
});
