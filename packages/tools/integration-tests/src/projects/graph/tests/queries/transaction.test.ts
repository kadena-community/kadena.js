import { describe, expect, test } from 'vitest';
import { devnetMiner } from '../../testdata/constants/accounts';
import { transferAmount } from '../../testdata/constants/amounts';
import { coinModuleHash } from '../../testdata/constants/modules';
import { getTransactionsQuery } from '../../testdata/queries/getTransactions';
import {createAccount, generateAccount} from '../../utils/account-utils';
import { base64Encode } from '../../utils/cryptography-utils';
import { sendQuery } from '../../utils/request-util';
import {
  transferFunds,
  transferFundsCrossChain,
} from '../../utils/transfer-utils';
import { genKeyPair } from '@kadena/cryptography-utils';

describe('Query: getTransactions', () => {
  test('Should return transactions.', async () => {
    // Given two accounts are generated for chain 0
    const sourceKeyPair = genKeyPair()
    const targetKeyPair = genKeyPair()

    const sourceAccount = await generateAccount(sourceKeyPair, '0');
    const targetAccount = await generateAccount(targetKeyPair, '0');
    await createAccount(sourceAccount)
    await createAccount(targetAccount)

    const query = getTransactionsQuery(sourceAccount.account);
    const initialResponse = await sendQuery(query);

    // Then there should be no transactions for the created account.
    expect(initialResponse.body.data.transactions.edges).toHaveLength(0);
    expect(initialResponse.body.data.transactions.totalCount).toEqual(0);

    // When a transfer is performed from source to target
    const transfer = await transferFunds(
      sourceAccount,
      targetAccount,
      transferAmount,
      '0',
    );

    // And the transfers are retrieved for the source account
    const finalResponse = await sendQuery(query);

    // Then the source should have two 1 transaction with 2 transfers, 2 events and signed by the Source Account
    expect(finalResponse.body.data.transactions.edges).toHaveLength(1);
    expect(finalResponse.body.data.transactions.totalCount).toEqual(1);
    expect(finalResponse.body.data.transactions.edges[0].node).toEqual({
      code: `\"(coin.transfer \\\"${sourceAccount.account}\\\" \\\"${targetAccount.account}\\\" 20.0)\"`,
      continuation: null,
      data: '{}',
      gas: 736,
      gasLimit: 2500,
      gasPrice: 1e-8,
      senderAccount: sourceAccount.account,
      ttl: 28800,
      chainId: 0,
      pactId: null,
      proof: null,
      rollback: null,
      requestKey: transfer.reqKey,
      eventCount: 2,
      id: base64Encode(
        `Transaction:["${transfer.metaData?.blockHash}","${transfer.reqKey}"]`,
      ),
      events: [
        {
          requestKey: transfer.reqKey,
          parameterText: `["${sourceAccount.account}","${devnetMiner.account}",7.36e-6]`,
          id: base64Encode(
            `Event:["${transfer.metaData?.blockHash}","0","${transfer.reqKey}"]`,
          ),
        },
        {
          requestKey: transfer.reqKey,
          parameterText: `["${sourceAccount.account}","${targetAccount.account}",20]`,
          id: base64Encode(
            `Event:["${transfer.metaData?.blockHash}","1","${transfer.reqKey}"]`,
          ),
        },
      ],
      transfers: [
        {
          amount: 0.00000736,
          chainId: 0,
          crossChainTransfer: null,
          receiverAccount: devnetMiner.account,
          requestKey: transfer.reqKey,
          senderAccount: sourceAccount.account,
          id: base64Encode(
            `Transfer:["${transfer.metaData?.blockHash}","0","0","${coinModuleHash}","${transfer.reqKey}"]`,
          ),
        },
        {
          amount: 20,
          chainId: 0,
          crossChainTransfer: null,
          receiverAccount: targetAccount.account,
          requestKey: transfer.reqKey,
          senderAccount: sourceAccount.account,
          id: base64Encode(
            `Transfer:["${transfer.metaData?.blockHash}","0","1","${coinModuleHash}","${transfer.reqKey}"]`,
          ),
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

  test('Should return cross chain transactions.', async () => {
    const sourceKeyPair = genKeyPair()
    const targetKeyPair = genKeyPair()
    const sourceAccountOnChain0 = await generateAccount(sourceKeyPair, '0');
    const sourceAccountOnChain1 = await generateAccount(sourceKeyPair, '1');
    const targetAccountOnChain1  = await generateAccount(targetKeyPair, '1');

    await createAccount(sourceAccountOnChain0);
    await createAccount(sourceAccountOnChain1);
    await createAccount(targetAccountOnChain1);

    // Given two accounts are generated. One for chain 0 and One for Chain 1.
    const query = getTransactionsQuery(sourceAccountOnChain0.account);
    const initialResponse = await sendQuery(query);

    // Then there should be no transactions for the created account.
    expect(initialResponse.body.data.transactions.edges).toHaveLength(0);
    expect(initialResponse.body.data.transactions.totalCount).toEqual(0);

    // When a transfer is performed from source to target
    const transfer = await transferFundsCrossChain(
      sourceAccountOnChain0,
      targetAccountOnChain1,
      transferAmount,
      '0',
      '1',
    );
    // And the transfers are retrieved for the source account
    const finalResponse = await sendQuery(query);
    console.log(finalResponse.body.data)

    // Then the source should have two 1 transaction with 2 transfers, 2 events and signed by the Source Account
    expect(finalResponse.body.data.transactions.edges).toHaveLength(1);
    expect(finalResponse.body.data.transactions.totalCount).toEqual(1);

    expect(finalResponse.body.data.transactions.edges[0].node).toEqual({
      code: `"(coin.transfer-crosschain \\"${sourceAccountOnChain0.account}\\" \\"${targetAccountOnChain1.account}\\" (read-keyset \\"account-guard\\") \\"1\\" ${transferAmount}.0)"`,
      data: `{"account-guard":{"keys":["${targetAccountOnChain1.publicKey}"],"pred":"keys-all"}}`,
      gas: 621,
      gasLimit: 2500,
      gasPrice: 1e-8,
      senderAccount: sourceAccountOnChain0.account,
      ttl: 28800,
      chainId: 0,
      pactId: null,
      proof: null,
      requestKey: transfer.reqKey,
      rollback: null,
      eventCount: 4,
      continuation:
        `{"step":0,"yield":{"data":{"amount":${transferAmount},"receiver":"${targetAccountOnChain1.account}","source-chain":"0","receiver-guard":{"keys":["${targetAccountOnChain1.publicKey}"],"pred":"keys-all"}},"source":"0","provenance":{"moduleHash":"${coinModuleHash}","targetChainId":"1"}},"pactId":"${transfer.reqKey}","executed":null,"stepCount":2,"continuation":{"def":"coin.transfer-crosschain","args":["${sourceAccountOnChain0.account}","${targetAccountOnChain1.account}",{"keys":["${targetAccountOnChain1.publicKey}"],"pred":"keys-all"},"1",20]},"stepHasRollback":false}`,
      id: base64Encode(
        `Transaction:["${transfer.metaData?.blockHash}","${transfer.reqKey}"]`,
      ),
      signers: [
        {
          capabilities: `[{"args":["${sourceAccountOnChain0.account}","${targetAccountOnChain1.account}",{"decimal":"20"},"1"],"name":"coin.TRANSFER_XCHAIN"},{"args":[],"name":"coin.GAS"}]`,
          publicKey: sourceAccountOnChain0.publicKey,
          requestKey: transfer.reqKey,
          id: base64Encode(`Signer:["${transfer.reqKey}","0"]`)
        }
      ],
      transfers: expect.any(Array),
      events: expect.any(Array),
    });
    console.log(finalResponse.body.data.transactions.edges[0].node.signers);
  });
});
