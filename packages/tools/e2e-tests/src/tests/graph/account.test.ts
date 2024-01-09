import { genKeyPair } from '@kadena/cryptography-utils';
import { sender00 } from '@fixtures/graph/testdata/constants/accounts';
import { getAccountQuery } from '@fixtures/graph/testdata/queries/getAccount';
import { createAccount, generateAccount } from '@helpers/graph/account.helper';
import { base64Encode } from '@helpers/graph/cryptography.helper';
import { sendQuery } from '@helpers/graph/request.helper';
import { test, expect} from '@playwright/test';

test('Query: getAccount by AccountName', async ({ request }) => {
  await test.step('Should return an account after it has been created', async () => {
    // Given a test account is created.
    const keyPair = genKeyPair();
    const testAccount = await generateAccount(keyPair, '0');
    const testDataResponse = await createAccount(testAccount);

    // When the getAccountQuery is executed
    const query = getAccountQuery(testAccount.account);
    const queryResponse = await sendQuery(request, query);

    //Then GraphQL should return the account, including 1 transfer.
    expect(queryResponse.body.data.fungibleAccount).toEqual({
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
        `FungibleAccount:FungibleAccount/coin/${testAccount.account}`,
      ),
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
