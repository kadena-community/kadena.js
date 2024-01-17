import type { IAccountWithSecretKey } from '@fixtures/graph/testdata/constants/accounts';
import { sender00 } from '@fixtures/graph/testdata/constants/accounts';
import { getAccountQuery } from '@fixtures/graph/testdata/queries/getAccount';
import {
  createAccount,
  generateAccount,
} from '@helpers/client-utils/account.helper';
import { base64Encode } from '@helpers/graph/cryptography.helper';
import { sendQuery } from '@helpers/graph/request.helper';
import { genKeyPair } from '@kadena/cryptography-utils';
import { expect, test } from '@playwright/test';

let testAccount: IAccountWithSecretKey;
let queryResponse: any;
let accountCreationResult: any;

test('Query: getAccount by AccountName', async ({ request }) => {
  await test.step('Given a test account has been created', async () => {
    const keyPair = genKeyPair();
    testAccount = await generateAccount(keyPair, '0');
    accountCreationResult = await createAccount(testAccount);
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
            keys: [testAccount.publicKey],
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
