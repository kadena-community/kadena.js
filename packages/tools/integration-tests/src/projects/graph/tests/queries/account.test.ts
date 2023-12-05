import request from 'supertest';
import { beforeEach, describe, expect, test } from 'vitest';
import { createAccount, generateAccount } from '../../support/utils'
import type { IAccountWithSecretKey } from '../../testdata/constants/accounts';
import { sender00 } from '../../testdata/constants/accounts';
import { grapHost } from '../../testdata/constants/network';
import { getAccountQuery } from '../../testdata/queries/getAccount';

let testAccount: IAccountWithSecretKey;

describe('Account', () => {
  beforeEach(async () => {
    testAccount = generateAccount()
  });

  test.skip('Query: getAccount by AccountName', async () => {
    // Given a test account is created.
    const testDataResponse = await createAccount(testAccount);

    // When the getAccountQuery is executed
    const query = getAccountQuery(testAccount.account);
    const queryResponse = await request(grapHost).post('').send(query);

   //Then GraphQL should return the account, including 1 transfer.
    expect(queryResponse.statusCode).toBe(200);
    expect(queryResponse.body.data.account).toEqual({
      __typename: 'ModuleAccount',
      accountName: testAccount.account,
      chainAccounts: [
        {
          __typename: 'ChainModuleAccount',
          balance: 100,
          chainId: '0',
          guard: {
            __typename: 'Guard',
            keys: [
              testAccount.publicKey,
            ],
            predicate: 'keys-all',
          },
        },
      ],
      id: expect.any(String),
      moduleName: 'coin',
      totalBalance: 100,
      transactions: {
        __typename: 'ModuleAccountTransactionsConnection',
        edges: [],
      },
      transfers: {
        __typename: 'ModuleAccountTransfersConnection',
        edges: [
          {
            __typename: 'ModuleAccountTransfersConnectionEdge',
            node: {
              __typename: 'Transfer',
              amount: 100,
              chainId: 0,
              crossChainTransfer: null,
              height: testDataResponse.metaData?.blockHeight,
              receiverAccount: testAccount.account,
              requestKey: testDataResponse.reqKey,
              senderAccount: sender00.account,
              transaction: {
                __typename: 'Transaction',
                pactId: null,
              },
            },
          },
        ],
      },
    });
  });
});
