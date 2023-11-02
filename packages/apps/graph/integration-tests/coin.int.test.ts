// import { buildHTTPExecutor } from '@graphql-tools/executor-http';
// import { loadSchema } from '@graphql-tools/load';
// import { loadFiles } from '@graphql-tools/load-files';
// import { parse } from 'graphql';
// import { createSchema, createYoga } from 'graphql-yoga';
// import { describe, expect, it } from 'vitest';
//
// describe('Tryout testcase', () => {
//   it('should return account', async () => {
//     const schema = createSchema({
//       typeDefs: await loadFiles('generated-schema.graphql'),
//       resolvers: await loadFiles('../src/graph/Query/**/*.{js,ts}'),
//     });
//
//     const yoga = createYoga({ schema });
//     const executor = buildHTTPExecutor({
//       fetch: yoga.fetch,
//     });
//
//     const result = await executor({
//       document: parse(/* GraphQL */ `
//         query {
//           account(
//             accountName: "k:b4ed71067dab2026852867729f499de3873f0b3d6aa22d6db1e94c922c86c328"
//             moduleName: "test"
//           ) {
//             id
//           }
//         }
//       `),
//     });
//     console.log(result);
//   });
// });
