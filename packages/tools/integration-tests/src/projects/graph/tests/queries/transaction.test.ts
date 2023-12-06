import request from 'supertest';
import { beforeEach, describe, expect, test } from 'vitest';
import { devnetMiner, devnetMinerPubKey, type IAccountWithSecretKey } from '../../testdata/constants/accounts';
import { grapHost } from '../../testdata/constants/network';
import { getTransactionsQuery } from '../../testdata/queries/getTransactions';
import { createAccount, generateAccount } from '../../utils/account-utils';
import { transferFunds } from '../../utils/transfer-utils';
import { base64Encode } from '../../utils/cryptography-utils';

let sourceAccount: IAccountWithSecretKey;
let targetAccount: IAccountWithSecretKey;
let query: object;

describe('Query: getTransactions', () => {
  beforeEach(async () => {
    sourceAccount = await generateAccount();
    //console.debug(sourceAccount);
    targetAccount = await generateAccount();
    query = getTransactionsQuery(sourceAccount.account);
  });

  test('Should return transactions, if they exist.', async () => {
    // Given an account is created and transactions are fetched.
    const sourceCreationResponse = await createAccount(sourceAccount);
    await createAccount(targetAccount);
    const initialResponse = await request(grapHost).post('').send(query);

    //console.log(sourceCreationResponse)

    // Then there should be no transactions for the created account.
    expect(initialResponse.statusCode).toBe(200);
    expect(initialResponse.body.data.transactions.edges).toHaveLength(0);
    expect(initialResponse.body.data.transactions.totalCount).toEqual(0);

    // When a transfer is performed from source to target
    await transferFunds(sourceAccount, targetAccount, '20', '0');

    // And the transfers are retrieved for the source account
    const finalResponse = await request(grapHost).post('').send(query);

    // Then the source should have two 1 transaction with 2 transfers.
    expect(finalResponse.statusCode).toBe(200);
    expect(finalResponse.body.data.transactions.edges).toHaveLength(1);
    expect(finalResponse.body.data.transactions.totalCount).toEqual(1);

    expect(finalResponse.body.data.transactions.edges[0].node).toEqual({
      code: `\"(coin.transfer \\\"${sourceAccount.account}\\\" \\\"${targetAccount.account}\\\" 20.0)\"`,
      data: '{}',
      gas: 736,
      gasLimit: 2500,
      gasPrice: 1e-8,
      metadata: null,
      senderAccount: sourceAccount.account,
      ttl: 28800,
      chainId: 0,
      requestKey: 'JGG87A8clJ9irY3ezG9xVaIPGd2Ft4bQNnAHMmjWMXI',
      eventCount: 2,
      id: base64Encode(`Event:["dgPZCX6FaD7l3NQDwraoCQtIH8zE2LeazXUkA3MxNTg","1","us7Qo_sL0PK2N3ny3RgI23oww3mGNga1FkYHwT3e8X0"]`),
      transfers: [
        {
          amount: 0.00000736,
          chainId: 0,
          receiverAccount:devnetMiner.account,
          requestKey: 'JGG87A8clJ9irY3ezG9xVaIPGd2Ft4bQNnAHMmjWMXI',
          senderAccount: sourceAccount.account,
          id: 'VHJhbnNmZXI6WyJHZ202al9oOVpmdUliRDJiR3VSeVY1aXRGUExkOFVjVUNhcG9YRXdFa1ZBIiwiMCIsIjAiLCJNMWdhYmFrcWtFaV8xTjhkUkt0NHo1bEV2MWt1Q19ueExUbnlEQ3VaSUswIiwiSkdHODdBOGNsSjlpclkzZXpHOXhWYUlQR2QyRnQ0YlFObkFITW1qV01YSSJd',
        },
        {
          amount: 20,
          chainId: 0,
          receiverAccount: targetAccount.account,
          requestKey: 'JGG87A8clJ9irY3ezG9xVaIPGd2Ft4bQNnAHMmjWMXI',
          senderAccount: sourceAccount.account,
          id: 'VHJhbnNmZXI6WyJHZ202al9oOVpmdUliRDJiR3VSeVY1aXRGUExkOFVjVUNhcG9YRXdFa1ZBIiwiMCIsIjEiLCJNMWdhYmFrcWtFaV8xTjhkUkt0NHo1bEV2MWt1Q19ueExUbnlEQ3VaSUswIiwiSkdHODdBOGNsSjlpclkzZXpHOXhWYUlQR2QyRnQ0YlFObkFITW1qV01YSSJd',
        },
      ],
      signers: [
        {
          capabilities: `[{\"args\":[\"k:2088c4f97c00b2b638457ae2f87aa02a1da15c8b42c51088df991b8f92da9d06\",\"k:26b29459802d0960c62968c7ef017416ac60beb7a83a4c24eea26a9a5f1ac9ea\",{\"decimal\":\"20\"}],\"name\":\"coin.TRANSFER\"},{\"args\":[],\"name\":\"coin.GAS\"}]`,
          publicKey: sourceAccount.publicKey,
          requestKey: 'JGG87A8clJ9irY3ezG9xVaIPGd2Ft4bQNnAHMmjWMXI',
          id: 'U2lnbmVyOlsiSkdHODdBOGNsSjlpclkzZXpHOXhWYUlQR2QyRnQ0YlFObkFITW1qV01YSSIsIjAiXQ==',
        },
      ],
    });

    // Then the source
    //expect(initialData.transfers.totalCount).toEqual(1)
    // expect(initialData.transfers.edges[0].node).toEqual({
    //   amount: fundAmount,
    //   chainId: 0,
    //   receiverAccount: sourceAccount.account,
    //   requestKey: sourceCreationResponse.reqKey,
    //   senderAccount: sender00.account,
    //   id: base64Encode(`Transfer:["${sourceCreationResponse.metaData?.blockHash}","0","1","${coinModuleHash}","${sourceCreationResponse.reqKey}"]`),
    // })

    // When a transfer is performed

    //   // And the getTransfers Query is executed
    //   const finalResponse = await request(grapHost).post('').send(query);
    //   const finalData = finalResponse.body.data

    //   // Then there should be 2 transactions with 4 events and 4 transfers (2 gas payments and 2 transfers)
    //   expect(finalResponse.statusCode).toBe(200);
    //   //expect(finalData.transfers.totalCount).toEqual(1)
    //     console.log(finalData.transfers)
  });
});
