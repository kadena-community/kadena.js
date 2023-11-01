import { builder } from '../builder';

export default builder.objectType('GeneralInfo', {
  description: 'General information about the graph and chainweb-data',
  fields: (t) => ({
    maximumConfirmationDepth: t.exposeInt('maximumConfirmationDepth'),
    minimumBlockHeigh: t.expose('minimumBlockHeigh', {
      type: 'BigInt',
      nullable: true,
    }),
  }),
});
