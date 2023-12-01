import { builder } from '../builder';

export default builder.objectType('GraphConfiguration', {
  description: 'General information about the graph and chainweb-data.',
  fields: (t) => ({
    maximumConfirmationDepth: t.exposeInt('maximumConfirmationDepth', {
      description:
        'The maximum confirmation depth configured in the environment variables.',
    }),
    minimumBlockHeight: t.expose('minimumBlockHeight', {
      type: 'BigInt',
      nullable: true,
      description: 'The minimum block height that is available in the graph.',
    }),
  }),
});
