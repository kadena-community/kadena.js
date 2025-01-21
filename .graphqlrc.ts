// .graphqlrc.ts or graphql.config.ts
export default {
  projects: {
    'graph-client': {
      schema: ['./packages/apps/graph/generated-schema.graphql'],
      documents: ['./packages/apps/graph-client/src/**/*.graph.ts'],
    },
    explorer: {
      schema: ['./packages/apps/graph/generated-schema.graphql'],
      documents: ['./packages/apps/explorer/src/**/*.graph.ts'],
    },
    'proof-of-us': {
      schema: ['./packages/apps/graph/generated-schema.graphql'],
      documents: ['./packages/apps/proof-of-us/src/**/*.graph.ts'],
    },
    'rwa-demo': {
      schema: ['./packages/apps/graph/generated-schema.graphql'],
      documents: ['./packages/apps/rwa-demo/src/**/*.graph.ts'],
    },
  },
};
