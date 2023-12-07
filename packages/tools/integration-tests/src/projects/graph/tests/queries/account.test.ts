import { describe, expect, test } from 'vitest';
import { sender00 } from '../../testdata/constants/accounts';
import { getAccountQuery } from '../../testdata/queries/getAccount';
import { createAccount, generateAccount } from '../../utils/account-utils';
import { base64Encode } from '../../utils/cryptography-utils';
import { sendQuery } from '../../utils/request-util';
import { genKeyPair } from '@kadena/cryptography-utils';

describe('Query: getAccount by AccountName', () => {
  test('Should return an account after it has been created', async () => {
    // Given a test account is created.
    const keyPair = genKeyPair()
    const testAccount = await generateAccount(keyPair, '0')
    const testDataResponse = await createAccount(testAccount);

    // When the getAccountQuery is executed
    const query = getAccountQuery(testAccount.account);
    const queryResponse = await sendQuery(query);

    //Then GraphQL should return the account, including 1 transfer.
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
