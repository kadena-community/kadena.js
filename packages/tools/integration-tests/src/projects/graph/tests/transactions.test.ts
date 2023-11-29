import request from 'supertest';
import { describe, expect, test } from 'vitest';
import { grapHost } from '../testdata/constants/network';
import { getTransactionsQuery } from '../testdata/queries/getTransactions';

describe('Transactions', () => {
  test('Query: getTransactions', async () => {
    const query = getTransactionsQuery();
    const response = await request(grapHost).post('').send(query);
    expect(response.statusCode).toBe(200);
    expect(response.body.data).toMatchInlineSnapshot({
      cursor: expect.any(String),
      hash: expect.any(String),
      code: expect.any(String)
    }, `
      {
        "transactions": {
          "__typename": "QueryTransactionsConnection",
          "edges": [
            {
              "__typename": "QueryTransactionsConnectionEdge",
              "cursor": "R1BDOko6WyJUZ0NjQ0M5eC11aGFHWDdRY2pGQnIzZ0JYTmNBT3R0WFlHODVyQnRTZUtVIiwiRmxpdmxRWk5vRjFTamhzamlubHhBUkU5UzlPYUVkODdlZnBPdU5Ta1NXcyJd",
              "node": {
                "__typename": "Transaction",
                "block": {
                  "__typename": "Block",
                  "hash": "TgCcCC9x-uhaGX7QcjFBr3gBXNcAOttXYG85rBtSeKU",
                },
                "chainId": 0,
                "code": "\\"(coin.transfer-create \\\\\\"k:a824823489744b04e6bbd392fef35860c3d6f4f1317e2df8b21572494987af84\\\\\\" \\\\\\"w:7f70T5WfMr8mRLun8dVHST4hG_jummKzFxuO8JJJ4ms:keys-all\\\\\\" (read-keyset \\\\\\"ks\\\\\\") 1.001)(coin.transfer \\\\\\"w:7f70T5WfMr8mRLun8dVHST4hG_jummKzFxuO8JJJ4ms:keys-all\\\\\\" \\\\\\"k:a824823489744b04e6bbd392fef35860c3d6f4f1317e2df8b21572494987af84\\\\\\" 0.001)\\"",
                "creationTime": "2023-11-29T09:08:20.000Z",
                "height": 307,
                "requestKey": "FlivlQZNoF1SjhsjinlxARE9S9OaEd87efpOuNSkSWs",
                "signers": [
                  {
                    "__typename": "Signer",
                    "publicKey": "a824823489744b04e6bbd392fef35860c3d6f4f1317e2df8b21572494987af84",
                    "signature": "f28290418892a2339b7e3bb2f6000149c29c1c525c6c39a90e8380bdbff4feb3ae6f337ecf745be3c417a88bdc18f49a4bc575b166d9cca5ff8091bd79161a01",
                  },
                  {
                    "__typename": "Signer",
                    "publicKey": "ad3eaaab118812498b20afd35a52809153f14dfbd9bec6557c4963edaca88f1d",
                    "signature": "fee3a107bbaf8d75e948addbe0ba0833d87d6863786bfb3c745f04cf3744092999a716292eb9c2f676247a112a9e849806b0b6ea08f3f4959525b4c7b900c40e",
                  },
                  {
                    "__typename": "Signer",
                    "publicKey": "4938c5e8ff4871cf186d023e270730f9ca9975ab7ff44023a8d2c00f36756448",
                    "signature": "196a55f0dc5902e86419092af27957349e8d5c684d00213ec8789370a9d2d6050cea013cd12fc7af7a0f6a8e0b17ae98a3cc15139d909f15518fcf2e8fa6c10b",
                  },
                ],
              },
            },
          ],
          "pageInfo": {
            "__typename": "PageInfo",
            "endCursor": "R1BDOko6WyJUZ0NjQ0M5eC11aGFHWDdRY2pGQnIzZ0JYTmNBT3R0WFlHODVyQnRTZUtVIiwiRmxpdmxRWk5vRjFTamhzamlubHhBUkU5UzlPYUVkODdlZnBPdU5Ta1NXcyJd",
            "hasNextPage": true,
            "hasPreviousPage": false,
            "startCursor": "R1BDOko6WyJUZ0NjQ0M5eC11aGFHWDdRY2pGQnIzZ0JYTmNBT3R0WFlHODVyQnRTZUtVIiwiRmxpdmxRWk5vRjFTamhzamlubHhBUkU5UzlPYUVkODdlZnBPdU5Ta1NXcyJd",
          },
          "totalCount": 33,
        },
      }
    `);
  });
});
