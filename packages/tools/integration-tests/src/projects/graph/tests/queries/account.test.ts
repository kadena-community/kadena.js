import request from 'supertest';
import { beforeEach, describe, expect, test } from 'vitest';
import type { IAccountWithSecretKey } from '../../testdata/constants/accounts';
import { sender00 } from '../../testdata/constants/accounts';
import { grapHost } from '../../testdata/constants/network';
import { getAccountQuery } from '../../testdata/queries/getAccount';
import { createAccount, generateAccount } from '../../utils/account-utils';
import { base64Encode } from '../../utils/cryptography-utils';

let testAccount: IAccountWithSecretKey;

describe('Query: getAccount by AccountName', () => {
  beforeEach(async () => {
    testAccount = await generateAccount();
  });

  test('Should return an account when after it has been created', async () => {
    // Given a test account is created.
    const testDataResponse = await createAccount(testAccount);

    // When the getAccountQuery is executed
    const query = getAccountQuery(testAccount.account);
    const queryResponse = await request(grapHost).post('').send(query);

    //Then GraphQL should return the account, including 1 transfer.
    expect(queryResponse.statusCode).toBe(200);
    expect(queryResponse.body.data.account).toEqual({
      accountName: testAccount.account,
      chainAccounts: [
        {
          balance: 100,
          chainId: '0',
          guard: {
            keys: [testAccount.publicKey],
            predicate: 'keys-all',
          },
        },
      ],
      id: base64Encode(
        `ModuleAccount:ModuleAccount/coin/${testAccount.account}`,
      ),
      moduleName: 'coin',
      totalBalance: 100,
      transactions: {
        edges: [],
      },
      transfers: {
        edges: [
          {
            node: {
              amount: 100,
              chainId: 0,
              crossChainTransfer: null,
              height: testDataResponse.metaData?.blockHeight,
              receiverAccount: testAccount.account,
              requestKey: testDataResponse.reqKey,
              senderAccount: sender00.account,
              transaction: {
                pactId: null,
              },
            },
          },
        ],
      },
    });
  });
});
