import { describe, expect, it } from 'vitest';
const easyGraphQLTester = require('easygraphql-tester');
const fs = require('fs');
const path = require('path');

const graphSchema = fs.readFileSync('./generated-schema.graphql', 'utf8');
describe('Tryout testcase', () => {
  it('should return transactions', async () => {
    const tester = new easyGraphQLTester(graphSchema);
    const validQuery = `query {
  transactions(accountName: "k:9301d28e9d1f9224f86cb2d885783b910cd1bf0abe7550f125398c7a412e6ff8") {
    edges {
      node {
        id
      }
    }
  }
}`;

    tester.test(false, validQuery);
  });
});
// const response = await fetch('http://localhost:4000/graphql', {
//   method: 'POST',
//   headers: {
//     'content-type': 'application/json;charset=UTF-8',
//   },
//   body: JSON.stringify({
//     query: validQuery,
//   }),
// });
