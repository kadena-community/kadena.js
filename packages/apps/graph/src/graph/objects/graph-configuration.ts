import { builder } from '../builder';

export default builder.objectType('GraphConfiguration', {
  description: 'General information about the graph and chainweb-data.',
  fields: (t) => ({
    minimumBlockHeight: t.expose('minimumBlockHeight', {
      type: 'BigInt',
      nullable: true,
      description: 'The lowest block-height that is indexed in this endpoint.',
    }),
  }),
});
