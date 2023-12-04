import { genKeyPair } from '@kadena/cryptography-utils';
import request from 'supertest';
import { beforeEach, describe, expect, test } from 'vitest';
import { createAccount } from '../../support/create-account';
import type { IAccount } from '../../testdata/constants/accounts';
import { sender00Account } from '../../testdata/constants/accounts';
import { grapHost } from '../../testdata/constants/network';
import { getAccountQuery } from '../../testdata/queries/getAccount';

let testAccount: IAccount;

describe('Account', () => {
  beforeEach(async () => {
    const keyPair = genKeyPair();
    testAccount = {
      account: `k:${keyPair.publicKey}`,
      publicKey: keyPair.publicKey,
      chainId: '0',
      guard: keyPair.publicKey,
      secretKey: keyPair.secretKey,
    };
  });

  test('Query: getAccount by AccountName', async () => {
    // Given a test account is created.
    const requestResponse = await createAccount(testAccount);
    console.log(requestResponse)

    // When the getAccountQuery is executed
    const query = getAccountQuery(testAccount.account);
    const queryResponse = await request(grapHost).post('').send(query);

   //Then GraphQL should return the account, including 1 transaction.
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
              height: requestResponse.metaData?.blockHeight,
              receiverAccount: testAccount.account,
              requestKey: requestResponse.reqKey,
              senderAccount: sender00Account.account,
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
