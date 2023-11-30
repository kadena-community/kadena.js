import request from 'supertest';
import { describe, expect, test } from 'vitest';
import { accountOne, sender00Account } from '../testdata/constants/accounts';
import { grapHost } from '../testdata/constants/network';
import { getAccountQuery } from '../testdata/queries/getAccount';
import { createAccount } from '../testdata/setup/create-account';

describe('Account', () => {
  test('Query: getAccount', async () => {
    // Given a test account is created.
   await createAccount(accountOne);

    // When the getAccountQuery is executed
    const query = getAccountQuery(accountOne.account);
    const response = await request(grapHost).post('').send(query);

    //Then the statuscode should be 200 and the snapshot should match, including specific property matchers.
    expect(response.statusCode).toBe(200);
   // ToMatchSnapshot uses Jests Property Matchers, any property defined below is (literally) matched against the snashot file
   // Properties that are defined below can be a little bit more flexible to prevent having to update the snapshot on every run
    expect(response.body.data.account).toMatchSnapshot({
      chainAccounts: [
        {
          balance: expect.any(Number), //Generic Assert, to prevent updating the snapshot.
        },
      ],
      totalBalance: expect.any(Number), //Generic Assert, to prevent updating the snapshot.
      transfers: {
        edges: expect.arrayContaining([
          expect.objectContaining({
            __typename: 'ModuleAccountTransfersConnectionEdge',
            node: {
              __typename: 'Transfer',
              amount: 100,
              chainId: 0,
              crossChainTransfer: null,
              height: expect.any(Number), //Generic Assert, to prevent updating the snapshot.
              receiverAccount: accountOne.account,
              requestKey: expect.any(String), //Generic Assert, to prevent updating the snapshot.
              senderAccount: sender00Account.account,
              transaction: {
                __typename: 'Transaction',
                pactId: null,
              },
            },
          }),
        ]),
      },
    });
  });
});
