import request from 'supertest';
import { beforeEach, describe, expect, test } from 'vitest';
import { devnetMiner, devnetMinerPubKey, type IAccountWithSecretKey } from '../../testdata/constants/accounts';
import { grapHost } from '../../testdata/constants/network';
import { getTransactionsQuery } from '../../testdata/queries/getTransactions';
import { createAccount, generateAccount } from '../../utils/account-utils';
import { transferFunds } from '../../utils/transfer-utils';
import { base64Encode } from '../../utils/cryptography-utils';
import { coinModuleHash } from '../../testdata/constants/modules';

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
    await createAccount(sourceAccount);
    await createAccount(targetAccount);
    const initialResponse = await request(grapHost).post('').send(query);

    // Then there should be no transactions for the created account.
    expect(initialResponse.statusCode).toBe(200);
    expect(initialResponse.body.data.transactions.edges).toHaveLength(0);
    expect(initialResponse.body.data.transactions.totalCount).toEqual(0);

    // When a transfer is performed from source to target
    const transfer = await transferFunds(sourceAccount, targetAccount, '20', '0');

    // And the transfers are retrieved for the source account
    const finalResponse = await request(grapHost).post('').send(query);

    // Then the source should have two 1 transaction with 2 transfers, 2 events and signed by the Source Account
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
      requestKey: transfer.reqKey,
      eventCount: 2,
      id: base64Encode(`Transaction:["${transfer.metaData?.blockHash}","${transfer.reqKey}"]`),
      events: [
        {
          requestKey: transfer.reqKey,
          parameterText: `["${sourceAccount.account}","${devnetMiner.account}",7.36e-6]`,
          id: base64Encode(`Event:["${transfer.metaData?.blockHash}","0","${transfer.reqKey}"]`)
        },
        {
          requestKey: transfer.reqKey,
          parameterText: `["${sourceAccount.account}","${targetAccount.account}",20]`,
          id: base64Encode(`Event:["${transfer.metaData?.blockHash}","1","${transfer.reqKey}"]`)
        }
      ],
      transfers: [
        {
          amount: 0.00000736,
          chainId: 0,
          receiverAccount:devnetMiner.account,
          requestKey: transfer.reqKey,
          senderAccount: sourceAccount.account,
          id: base64Encode(`Transfer:["${transfer.metaData?.blockHash}","0","0","${coinModuleHash}","${transfer.reqKey}"]`),
        },
        {
          amount: 20,
          chainId: 0,
          receiverAccount: targetAccount.account,
          requestKey: transfer.reqKey,
          senderAccount: sourceAccount.account,
          id: base64Encode(`Transfer:["${transfer.metaData?.blockHash}","0","1","${coinModuleHash}","${transfer.reqKey}"]`),
        },
      ],
      signers: [
        {
          capabilities: `[{\"args\":[\"${sourceAccount.account}\",\"${targetAccount.account}\",{\"decimal\":\"20\"}],\"name\":\"coin.TRANSFER\"},{\"args\":[],\"name\":\"coin.GAS\"}]`,
          publicKey: sourceAccount.publicKey,
          requestKey: transfer.reqKey,
          id: base64Encode(`Signer:["${transfer.reqKey}","0"]`),
        },
      ],
    });
  });
});
