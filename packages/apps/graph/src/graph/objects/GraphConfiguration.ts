import { builder } from '../builder';

export default builder.objectType('GraphConfiguration', {
  description: 'General information about the graph and chainweb-data',
  fields: (t) => ({
    maximumConfirmationDepth: t.exposeInt('maximumConfirmationDepth'),
    minimumBlockHeight: t.expose('minimumBlockHeight', {
      type: 'BigInt',
      nullable: true,
    }),
  }),
});
