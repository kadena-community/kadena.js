import { sender00Account } from '@constants/accounts.constants';
import { getAccountQuery } from '@fixtures/graph/getAccount';
import {
  createAccount,
  generateAccount,
} from '@helpers/client-utils/accounts.helper';
import { base64Encode } from '@helpers/graph/cryptography.helper';
import { sendQuery } from '@helpers/graph/request.helper';
import { expect, test } from '@playwright/test';
import type { IAccount } from '@test-types/account.types';

let testAccount: IAccount;
let queryResponse: any;
let accountCreationResult: any;

test('Query: getAccount by AccountName', async ({ request }) => {
  await test.step('Given a test account has been created', async () => {
    testAccount = await generateAccount(1, ['0']);
    accountCreationResult = await createAccount(
      testAccount,
      testAccount.chains[0],
    );
  });
  await test.step('When the getAccountQuery is executed', async () => {
    const query = getAccountQuery(testAccount.account);
    queryResponse = await sendQuery(request, query);
  });
  await test.step('Should return an account after it has been created', async () => {
    expect(queryResponse.fungibleAccount).toEqual({
      accountName: testAccount.account,
      chainAccounts: [
        {
          balance: 100,
          chainId: '0',
          guard: {
            keys: [testAccount.keys[0].publicKey],
            predicate: 'keys-all',
          },
        },
      ],
      id: base64Encode(`FungibleAccount:["coin","${testAccount.account}"]`),
      fungibleName: 'coin',
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
              height: accountCreationResult.metaData?.blockHeight,
              receiverAccount: testAccount.account,
              requestKey: accountCreationResult.reqKey,
              senderAccount: sender00Account.account,
              transaction: {
                cmd: {
                  payload: {},
                },
              },
            },
          },
        ],
      },
    });
  });
});
