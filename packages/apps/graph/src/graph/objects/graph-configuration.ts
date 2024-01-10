import { builder } from '../builder';

export default builder.objectType('GraphConfiguration', {
  description: 'General information about the graph and chainweb-data.',
  fields: (t) => ({
    maximumConfirmationDepth: t.exposeInt('maximumConfirmationDepth', {
      description:
        'The maximum number of confirmations calculated on this endpoint.',
    }),
    minimumBlockHeight: t.expose('minimumBlockHeight', {
      type: 'BigInt',
      nullable: true,
      description: 'The lowest block-height that is indexed in this endpoint.',
    }),
  }),
});
