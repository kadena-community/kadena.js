module.exports = {
  client: {
    service: {
      name: 'Kadena-mainnet',
      localSchemaFile: __dirname + '/../graph/generated-schema.graphql',
    },
    includes: ['src/**/*.ts', 'src/**/*.tsx'],
    excludes: ['**/node_modulues/**/*', 'src/__generated__/**/*'],
  },
};
