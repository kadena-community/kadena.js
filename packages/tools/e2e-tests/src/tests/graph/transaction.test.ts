import type { IAccountWithSecretKey } from '@fixtures/graph/testdata/constants/accounts';
import { devnetMiner } from '@fixtures/graph/testdata/constants/accounts';
import { transferAmount } from '@fixtures/graph/testdata/constants/amounts';
import { coinModuleHash } from '@fixtures/graph/testdata/constants/modules';
import { getTransactionsQuery } from '@fixtures/graph/testdata/queries/getTransactions';
import { createAccount, generateAccount } from '@helpers/graph/account.helper';
import { getBlockHash } from '@helpers/graph/block.helper';
import { base64Encode } from '@helpers/graph/cryptography.helper';
import { sendQuery } from '@helpers/graph/request.helper';
import {
  transferFunds,
  transferFundsCrossChain,
} from '@helpers/graph/transfer.helper';
import type { ICommandResult } from '@kadena/client';
import { genKeyPair } from '@kadena/cryptography-utils';
import { expect, test } from '@playwright/test';

test.describe('Query: getTransactions', async () => {
  test('Query: getTransactions - Same Chain Transfer', async ({ request }) => {
    // declare testcase scoped variables.
    let query: any;
    let sourceAccount: IAccountWithSecretKey;
    let targetAccount: IAccountWithSecretKey;
    let initialResponse: any;
    let transfer: ICommandResult;
    let finalResponse: any;

    await test.step('Create a source and target account on chain 0.', async () => {
      const sourceKeyPair = genKeyPair();
      const targetKeyPair = genKeyPair();
      sourceAccount = await generateAccount(sourceKeyPair, '0');
      targetAccount = await generateAccount(targetKeyPair, '0');
      await createAccount(sourceAccount);
      await createAccount(targetAccount);
    });
    await test.step('There are no transactions from the sourceAccount.', async () => {
      query = getTransactionsQuery(sourceAccount.account);
      initialResponse = await sendQuery(request, query);

      expect(initialResponse.transactions.edges).toHaveLength(0);
      expect(initialResponse.transactions.totalCount).toEqual(0);
    });

    await test.step('Transfer funds from sourceAccount to targetAccount.', async () => {
      transfer = await transferFunds(
        sourceAccount,
        targetAccount,
        transferAmount,
        '0',
      );
    });
    await test.step('SourceAccount has 1 transaction.', async () => {
      finalResponse = await sendQuery(request, query);
      expect(finalResponse.transactions.edges).toHaveLength(1);
      expect(finalResponse.transactions.totalCount).toEqual(1);
      expect(finalResponse.transactions.edges[0].node).toEqual({
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
  });

  test('Query: getTransactions - Cross Chain Transfer', async ({ request }) => {
    // declare testcase scoped variables.
    let sourceAccountOnChain0: IAccountWithSecretKey;
    let sourceAccountOnChain1: IAccountWithSecretKey;
    let targetAccountOnChain1: IAccountWithSecretKey;
    let query: any;
    let initialResponse: any;
    let transfer: ICommandResult;
    let finalResponse: any;
    let continuationBlockHash: string;

    await test.step('create a source account on chains 0 and 1 and a target account on chain 1.', async () => {
      const sourceKeyPair = genKeyPair();
      const targetKeyPair = genKeyPair();
      sourceAccountOnChain0 = await generateAccount(sourceKeyPair, '0');
      sourceAccountOnChain1 = await generateAccount(sourceKeyPair, '1');
      targetAccountOnChain1 = await generateAccount(targetKeyPair, '1');
      await createAccount(sourceAccountOnChain0);
      await createAccount(sourceAccountOnChain1);
      await createAccount(targetAccountOnChain1);
    });

    await test.step('There are no transactions from the sourceAccount.', async () => {
      query = getTransactionsQuery(sourceAccountOnChain0.account);
      initialResponse = await sendQuery(request, query);
      expect(initialResponse.transactions.edges).toHaveLength(0);
      expect(initialResponse.transactions.totalCount).toEqual(0);
    });

    await test.step('Transfer funds from sourceAccount (Chain 0) to targetAccount (Chain 1).', async () => {
      transfer = await transferFundsCrossChain(
        sourceAccountOnChain0,
        targetAccountOnChain1,
        transferAmount,
        '0',
        '1',
      );
      continuationBlockHash = await getBlockHash(
        request,
        transfer.continuation?.pactId,
      );
    });
    await test.step('SourceAccount has a transfer on Chain 0 and the Continuation on Chain 1', async () => {
      finalResponse = await sendQuery(request, query);
      expect(finalResponse.transactions.totalCount).toEqual(2);
      expect(finalResponse.transactions.edges[0].node).toEqual({
        code: '"cont"',
        data: '{}',
        gas: 473,
        gasLimit: 2500,
        gasPrice: 1e-8,
        senderAccount: sourceAccountOnChain0.account,
        continuation: `{"step":1,"yield":null,"pactId":"${transfer.continuation?.pactId}","executed":null,"stepCount":2,"continuation":{"def":"coin.transfer-crosschain","args":["${sourceAccountOnChain0.account}","${targetAccountOnChain1.account}",{"keys":["${targetAccountOnChain1.publicKey}"],"pred":"keys-all"},"1",20]},"stepHasRollback":false}`,
        pactId: transfer.continuation?.pactId,
        proof: expect.anything(),
        rollback: false,
        ttl: 28800,
        chainId: 1,
        requestKey: transfer.reqKey,
        eventCount: 4,
        id: base64Encode(
          `Transaction:["${transfer.metaData?.blockHash}","${transfer.reqKey}"]`,
        ),
        events: [
          {
            requestKey: transfer.reqKey,
            parameterText: `["${sourceAccountOnChain0.account}","${devnetMiner.account}",4.73e-6]`,
            id: base64Encode(
              `Event:["${transfer.metaData?.blockHash}","0","${transfer.reqKey}"]`,
            ),
          },
          {
            requestKey: transfer.reqKey,
            parameterText: `["","${targetAccountOnChain1.account}",20]`,
            id: base64Encode(
              `Event:["${transfer.metaData?.blockHash}","1","${transfer.reqKey}"]`,
            ),
          },
          {
            requestKey: transfer.reqKey,
            parameterText: `["","${targetAccountOnChain1.account}",20,"0"]`,
            id: base64Encode(
              `Event:["${transfer.metaData?.blockHash}","2","${transfer.reqKey}"]`,
            ),
          },
          {
            requestKey: transfer.reqKey,
            parameterText: `["0","coin.transfer-crosschain",["${sourceAccountOnChain0.account}","${targetAccountOnChain1.account}",{"pred":"keys-all","keys":["${targetAccountOnChain1.publicKey}"]},"1",20]]`,
            id: base64Encode(
              `Event:["${transfer.metaData?.blockHash}","3","${transfer.reqKey}"]`,
            ),
          },
        ],
        transfers: [
          {
            amount: 0.00000473,
            chainId: 1,
            receiverAccount: devnetMiner.account,
            requestKey: transfer.reqKey,
            senderAccount: sourceAccountOnChain0.account,
            id: base64Encode(
              `Transfer:["${transfer.metaData?.blockHash}","1","0","${coinModuleHash}","${transfer.reqKey}"]`,
            ),
            crossChainTransfer: null,
          },
          {
            amount: 20,
            chainId: 1,
            receiverAccount: targetAccountOnChain1.account,
            requestKey: transfer.reqKey,
            senderAccount: '',
            id: base64Encode(
              `Transfer:["${transfer.metaData?.blockHash}","1","1","${coinModuleHash}","${transfer.reqKey}"]`,
            ),
            crossChainTransfer: {
              amount: 20,
              blockHash: continuationBlockHash,
              chainId: 0,
              moduleName: 'coin',
              receiverAccount: '',
              requestKey: transfer.continuation?.pactId,
              senderAccount: sourceAccountOnChain0.account,
              id: base64Encode(
                `Transfer:["${continuationBlockHash}","0","2","${coinModuleHash}","${transfer.continuation?.pactId}"]`,
              ),
            },
          },
        ],
        signers: [
          {
            capabilities: '[{"args":[],"name":"coin.GAS"}]',
            publicKey: sourceAccountOnChain0.publicKey,
            requestKey: transfer.reqKey,
            id: base64Encode(`Signer:["${transfer.reqKey}","0"]`),
          },
        ],
      });
      expect(finalResponse.transactions.edges[1].node).toEqual({
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
        requestKey: transfer.continuation?.pactId,
        rollback: null,
        eventCount: 4,
        continuation: `{\"step\":0,\"yield\":{\"data\":{\"amount\":20,\"receiver\":\"${targetAccountOnChain1.account}\",\"source-chain\":\"0\",\"receiver-guard\":{\"keys\":[\"${targetAccountOnChain1.publicKey}\"],\"pred\":\"keys-all\"}},\"source\":\"0\",\"provenance\":{\"moduleHash\":\"${coinModuleHash}\",\"targetChainId\":\"1\"}},\"pactId\":\"${transfer.continuation?.pactId}\",\"executed\":null,\"stepCount\":2,\"continuation\":{\"def\":\"coin.transfer-crosschain\",\"args\":[\"${sourceAccountOnChain0.account}\",\"${targetAccountOnChain1.account}\",{\"keys\":[\"${targetAccountOnChain1.publicKey}\"],\"pred\":\"keys-all\"},\"1\",20]},\"stepHasRollback\":false}`,
        id: base64Encode(
          `Transaction:["${continuationBlockHash}","${transfer.continuation?.pactId}"]`,
        ),
        signers: [
          {
            capabilities: `[{"args":["${sourceAccountOnChain0.account}","${targetAccountOnChain1.account}",{"decimal":"20"},"1"],"name":"coin.TRANSFER_XCHAIN"},{"args":[],"name":"coin.GAS"}]`,
            publicKey: sourceAccountOnChain0.publicKey,
            requestKey: transfer.continuation?.pactId,
            id: base64Encode(`Signer:["${transfer.continuation?.pactId}","0"]`),
          },
        ],
        transfers: [
          {
            amount: 0.00000621,
            chainId: 0,
            receiverAccount: devnetMiner.account,
            requestKey: transfer.continuation?.pactId,
            senderAccount: sourceAccountOnChain0.account,
            id: base64Encode(
              `Transfer:["${continuationBlockHash}","0","0","${coinModuleHash}","${transfer.continuation?.pactId}"]`,
            ),
            crossChainTransfer: null,
          },
          {
            amount: 20,
            chainId: 0,
            receiverAccount: '',
            requestKey: transfer.continuation?.pactId, // feels like this should be the transfer.reqKey
            senderAccount: sourceAccountOnChain0.account,
            id: base64Encode(
              `Transfer:["${continuationBlockHash}","0","2","${coinModuleHash}","${transfer.continuation?.pactId}"]`, // feels like this should not be the continuation block has and pactId
            ),
            crossChainTransfer: {
              amount: 20,
              blockHash: transfer.metaData?.blockHash,
              chainId: 1,
              moduleName: 'coin',
              receiverAccount: targetAccountOnChain1.account,
              requestKey: transfer.reqKey,
              senderAccount: '',
              id: base64Encode(
                `Transfer:["${transfer.metaData?.blockHash}","1","1","${coinModuleHash}","${transfer.reqKey}"]`, // feels like this should be the continuation block has and pactId?
              ),
            },
          },
        ],
        events: [
          {
            requestKey: transfer.continuation?.pactId,
            parameterText: `["${sourceAccountOnChain0.account}","${devnetMiner.account}",6.21e-6]`,
            id: base64Encode(
              `Event:["${continuationBlockHash}","0","${transfer.continuation?.pactId}"]`,
            ),
          },
          {
            requestKey: transfer.continuation?.pactId,
            parameterText: `["${sourceAccountOnChain0.account}","${targetAccountOnChain1.account}",20,"1"]`,
            id: base64Encode(
              `Event:["${continuationBlockHash}","1","${transfer.continuation?.pactId}"]`,
            ),
          },
          {
            requestKey: transfer.continuation?.pactId,
            parameterText: `["${sourceAccountOnChain0.account}","",20]`,
            id: base64Encode(
              `Event:["${continuationBlockHash}","2","${transfer.continuation?.pactId}"]`,
            ),
          },
          {
            requestKey: transfer.continuation?.pactId,
            parameterText: `["1","coin.transfer-crosschain",["${sourceAccountOnChain0.account}","${targetAccountOnChain1.account}",{"pred":"keys-all","keys":["${targetAccountOnChain1.publicKey}"]},"1",20]]`,
            id: base64Encode(
              `Event:["${continuationBlockHash}","3","${transfer.continuation?.pactId}"]`,
            ),
          },
        ],
      });
    });
  });
});
