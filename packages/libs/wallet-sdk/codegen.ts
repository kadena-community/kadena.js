import type { CodegenConfig } from '@graphql-codegen/cli';
import * as fs from 'node:fs';

const config: CodegenConfig = {
  schema: 'https://graph.testnet.kadena.network/graphql',
  documents: ['src/**/*.ts'],
  ignoreNoDocuments: true,
  generates: {
    './src/gql/': {
      preset: 'client',
      config: { useTypeImports: true },
    },
  },
  config: {
    scalars: {
      BigInt: 'number',
      DateTime: 'string',
    },
  },
  hooks: {
    afterAllFileWrite(...files) {
      for (let i = 0; i < files.length; i++) {
        const filePath = files[i];
        const content = fs.readFileSync(filePath, 'utf-8');
        const replaced = content
          .replaceAll(
            "import * as types from './graphql';",
            "import * as types from './graphql.js';",
          )
          .replaceAll(
            "import type { Incremental } from './graphql';",
            "import type { Incremental } from './graphql.js';",
          )
          .replaceAll(
            'export * from "./fragment-masking";',
            'export * from "./fragment-masking.js";',
          )
          .replaceAll('export * from "./gql";', 'export * from "./gql.js";');
        fs.writeFileSync(filePath, replaced);
      }
    },
  },
};
export default config;
