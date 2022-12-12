import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:3000/graph',
  documents: 'src/**/*.tsx',
  generates: {
    './src/__generated__': {
      preset: 'client',
      plugins: [],
    },
    './src/__generated__/graphql.schema.json': {
      plugins: ['introspection'],
    },
  },
};

export default config;
