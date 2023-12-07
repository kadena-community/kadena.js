import request from 'supertest';
import { describe, expect, test } from 'vitest';
import { devnetMiner  } from '../../testdata/constants/accounts';
import { grapHost } from '../../testdata/constants/network';
import { getTransactionsQuery, getxChainTransactionsQuery } from '../../testdata/queries/getTransactions';
import * as accountUtils from '../../utils/account-utils';
import { transferFunds, transferFundsCrossChain } from '../../utils/transfer-utils';
import { base64Encode } from '../../utils/cryptography-utils';
import { coinModuleHash } from '../../testdata/constants/modules';
import { transferAmount } from '../../testdata/constants/amounts';

describe('Query: getTransactions', () => {

  test.skip('Should return transactions.', async () => {
    const sourceAccount = await accountUtils.generateAccount('0');
    const targetAccount = await accountUtils.generateAccount('0');
    const query = getTransactionsQuery(sourceAccount.account);

    // Given an account is created and transactions are fetched.
    await accountUtils.createAccount(sourceAccount);
    await accountUtils.createAccount(targetAccount);
    console.log('REGULAR TRANSFER')
    console.log(sourceAccount)
    console.log(targetAccount)
    const initialResponse = await request(grapHost).post('').send(query);
   

    // Then there should be no transactions for the created account.
    expect(initialResponse.statusCode).toBe(200);
    expect(initialResponse.body.data.transactions.edges).toHaveLength(0);
    expect(initialResponse.body.data.transactions.totalCount).toEqual(0);

    // When a transfer is performed from source to target
    const transfer = await transferFunds(sourceAccount, targetAccount, transferAmount, '0');

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

  test.skip('Should return cross chain transactions.', async () => {
    const sourceAccountOnChain0 = await accountUtils.generateAccount('0');
    //const sourceChain1 = await accountUtils.generateAccount('1');
    const targetAccountOnChain1 = await accountUtils.generateAccount('1');
    const query = getxChainTransactionsQuery(sourceAccountOnChain0.account);

    // Given an account is created and transactions are fetched.
    await accountUtils.createAccount(sourceAccountOnChain0);
    //await accountUtils.createAccount(sourceChain1);
    await accountUtils.createAccount(targetAccountOnChain1);
    const initialResponse = await request(grapHost).post('').send(query);

    // Then there should be no transactions for the created account.
    expect(initialResponse.statusCode).toBe(200);
    expect(initialResponse.body.data.transactions.edges).toHaveLength(0);
    expect(initialResponse.body.data.transactions.totalCount).toEqual(0);

    // When a transfer is performed from source to target
    const transfer = await transferFundsCrossChain(sourceAccountOnChain0, targetAccountOnChain1, transferAmount, '0', '1');
    console.log(transfer)

    // And the transfers are retrieved for the source account
    const finalResponse = await request(grapHost).post('').send(query);

    // Then the source should have two 1 transaction with 2 transfers, 2 events and signed by the Source Account
    expect(finalResponse.statusCode).toBe(200);
    expect(finalResponse.body.data.transactions.edges).toHaveLength(1);
    expect(finalResponse.body.data.transactions.totalCount).toEqual(1);

    expect(finalResponse.body.data.transactions.edges[0].node).toEqual( {
      code: `"(coin.transfer-crosschain \\"${sourceAccountOnChain0.account}\\" \\"${targetAccountOnChain1.account}\\" (read-keyset \\"account-guard\\") \\"1\\" ${transferAmount}.0)"`,
      data: `{"account-guard":{"keys":["${sourceAccountOnChain0.publicKey}"],"pred":"keys-all"}}`,
      gas: 621,
      gasLimit: 2500,
      gasPrice: 1e-8,
      senderAccount: sourceAccountOnChain0.account,
      ttl: 28800,
      chainId: 0,
      requestKey: transfer.reqKey,
      eventCount: 4,
      id: base64Encode(`Transaction:["${transfer.metaData?.blockHash}","${transfer.reqKey}"]`),
      signers: expect.any(Array),
      transfers: expect.any(Array),
      events: expect.any(Array)
    })
    console.log(finalResponse.body.data.transactions.edges)
  });

});
