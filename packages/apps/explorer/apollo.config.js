module.exports = {
  client: {
    service: {
      name: 'graph',
      localSchemaFile: __dirname + '/../graph/generated-schema.graphql',
    },
    includes: ['src/**/*.ts', 'src/**/*.tsx'],
    excludes: ['**/node_modules/**/*', 'src/__generated__/**/*'],
  },
};
