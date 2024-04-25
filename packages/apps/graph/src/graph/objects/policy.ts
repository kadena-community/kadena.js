import { builder } from '../builder';
import ModuleReference from './module-reference';

export default builder.objectType('Policy', {
  description: 'A policy that defines the rules for a non-fungible token.',
  fields: (t) => ({
    refSpec: t.field({
      type: [ModuleReference],
      resolve: (parent) => parent.refSpec,
    }),
    refName: t.field({
      type: ModuleReference,
      resolve: (parent) => parent.refName,
    }),
  }),
});
