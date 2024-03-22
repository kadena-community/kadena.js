import { devnetMiner } from '@kadena-dev/e2e-base/src/constants/accounts.constants';
import { transferAmount } from '@kadena-dev/e2e-base/src/constants/amounts.constants';
import { coinModuleHash } from '@kadena-dev/e2e-base/src/constants/coin.constants';
import {
  createAccount,
  generateAccount,
} from '@kadena-dev/e2e-base/src/helpers/client-utils/accounts.helper';
import {
  transferFunds,
  transferFundsCrossChain,
} from '@kadena-dev/e2e-base/src/helpers/client-utils/transfer.helper';
import type { IAccount } from '@kadena-dev/e2e-base/src/types/account.types';
import type { ICommandResult } from '@kadena/client';
import { expect, test } from '@playwright/test';
import { getBlockHash } from '../helpers/block.helper';
import { base64Encode } from '../helpers/cryptography.helper';
import { sendQuery } from '../helpers/request.helper';
import { getTransactionsQuery } from '../queries/getTransactions';

test.describe('Query: getTransactions', async () => {
  test('Query: getTransactions - Same Chain Transfer', async ({ request }) => {
    // declare testcase scoped variables.
    let query: any;
    let sourceAccount: IAccount;
    let targetAccount: IAccount;
    let initialResponse: any;
    let transfer: ICommandResult;
    let finalResponse: any;

    await test.step('Create a source and target account on chain 0.', async () => {
      sourceAccount = await generateAccount(1, ['0']);
      targetAccount = await generateAccount(1, ['0']);
      await createAccount(sourceAccount, sourceAccount.chains[0]);
      await createAccount(targetAccount, sourceAccount.chains[0]);
    });
    await test.step('There are no transactions from the sourceAccount.', async () => {
      await expect(async () => {
        query = getTransactionsQuery(sourceAccount.account);
        initialResponse = await sendQuery(request, query);
        expect(initialResponse.transactions.edges).toHaveLength(0);
        expect(initialResponse.transactions.totalCount).toEqual(0);
      }).toPass({
        timeout: 6000,
      });
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
      await expect(async () => {
        finalResponse = await sendQuery(request, query);

        expect(finalResponse.transactions.edges).toHaveLength(1);
        expect(finalResponse.transactions.totalCount).toEqual(1);
        expect(finalResponse.transactions.edges[0].node).toEqual({
          cmd: {
            meta: {
              gasLimit: 2500,
              gasPrice: 1e-8,
              sender: sourceAccount.account,
              ttl: 28800,
              chainId: 0,
            },
            payload: {
              code: `\"(coin.transfer \\\"${sourceAccount.account}\\\" \\\"${targetAccount.account}\\\" 20.0)\"`,
              data: '{}',
            },
            signers: [
              {
                capabilities: `[{\"args\":[\"${sourceAccount.account}\",\"${targetAccount.account}\",{\"decimal\":\"20\"}],\"name\":\"coin.TRANSFER\"},{\"args\":[],\"name\":\"coin.GAS\"}]`,
                publicKey: sourceAccount.keys[0].publicKey,
                requestKey: transfer.reqKey,
                id: base64Encode(`Signer:["${transfer.reqKey}","0"]`),
              },
            ],
          },
          hash: transfer.reqKey,
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
          result: {
            continuation: null,
            eventCount: 2,
            gas: 736,
          },
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
        });
      }).toPass({
        timeout: 6000,
      });
    });
  });

  test('Query: getTransactions - Cross Chain Transfer', async ({ request }) => {
    // declare testcase scoped variables.
    let sourceAccount: IAccount;
    let targetAccount: IAccount;
    let query: any;
    let initialResponse: any;
    let transfer: ICommandResult;
    let finalResponse: any;
    let continuationBlockHash: string;

    await test.step('create a source account on chains 0 and 1 and a target account on chain 1.', async () => {
      sourceAccount = await generateAccount(1, ['0', '1']);
      targetAccount = await generateAccount(1, ['1']);
      await createAccount(sourceAccount, sourceAccount.chains[0]);
      await createAccount(sourceAccount, sourceAccount.chains[1]);
      await createAccount(targetAccount, sourceAccount.chains[0]);
    });

    await test.step('There are no transactions from the sourceAccount.', async () => {
      await expect(async () => {
        query = getTransactionsQuery(sourceAccount.account);
        initialResponse = await sendQuery(request, query);
        expect(initialResponse.transactions.edges).toHaveLength(0);
        expect(initialResponse.transactions.totalCount).toEqual(0);
      }).toPass({
        timeout: 6000,
      });
    });

    await test.step('Transfer funds from sourceAccount (Chain 0) to targetAccount (Chain 1).', async () => {
      transfer = await transferFundsCrossChain(
        sourceAccount,
        targetAccount,
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
      await expect(async () => {
        finalResponse = await sendQuery(request, query);
        expect(finalResponse.transactions.totalCount).toEqual(2);
        expect(finalResponse.transactions.edges[0].node).toEqual({
          result: {
            continuation: `{"step":1,"yield":null,"pactId":"${transfer.continuation?.pactId}","executed":null,"stepCount":2,"continuation":{"def":"coin.transfer-crosschain","args":["${sourceAccount.account}","${targetAccount.account}",{"keys":["${targetAccount.keys[0].publicKey}"],"pred":"keys-all"},"1",20]},"stepHasRollback":false}`,
            gas: 478,
            eventCount: 4,
          },
          cmd: {
            meta: {
              gasLimit: 2500,
              gasPrice: 1e-8,
              sender: sourceAccount.account,
              ttl: 28800,
              chainId: 1,
            },
            payload: {
              data: '{}',
              pactId: transfer.continuation?.pactId,
              proof: expect.anything(),
              rollback: false,
            },
            signers: [
              {
                capabilities: '[{"args":[],"name":"coin.GAS"}]',
                publicKey: sourceAccount.keys[0].publicKey,
                requestKey: transfer.reqKey,
                id: base64Encode(`Signer:["${transfer.reqKey}","0"]`),
              },
            ],
          },
          hash: transfer.reqKey,
          id: base64Encode(
            `Transaction:["${transfer.metaData?.blockHash}","${transfer.reqKey}"]`,
          ),
          events: [
            {
              requestKey: transfer.reqKey,
              parameterText: `["${sourceAccount.account}","${devnetMiner.account}",4.78e-6]`,
              id: base64Encode(
                `Event:["${transfer.metaData?.blockHash}","0","${transfer.reqKey}"]`,
              ),
            },
            {
              requestKey: transfer.reqKey,
              parameterText: `["","${targetAccount.account}",20]`,
              id: base64Encode(
                `Event:["${transfer.metaData?.blockHash}","1","${transfer.reqKey}"]`,
              ),
            },
            {
              requestKey: transfer.reqKey,
              parameterText: `["","${targetAccount.account}",20,"0"]`,
              id: base64Encode(
                `Event:["${transfer.metaData?.blockHash}","2","${transfer.reqKey}"]`,
              ),
            },
            {
              requestKey: transfer.reqKey,
              parameterText: `["0","coin.transfer-crosschain",["${sourceAccount.account}","${targetAccount.account}",{"keys":["${targetAccount.keys[0].publicKey}"],"pred":"keys-all"},"1",20]]`,
              id: base64Encode(
                `Event:["${transfer.metaData?.blockHash}","3","${transfer.reqKey}"]`,
              ),
            },
          ],
          transfers: [
            {
              amount: 0.00000478,
              chainId: 1,
              receiverAccount: devnetMiner.account,
              requestKey: transfer.reqKey,
              senderAccount: sourceAccount.account,
              id: base64Encode(
                `Transfer:["${transfer.metaData?.blockHash}","1","0","${coinModuleHash}","${transfer.reqKey}"]`,
              ),
              crossChainTransfer: null,
            },
            {
              amount: 20,
              chainId: 1,
              receiverAccount: targetAccount.account,
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
                senderAccount: sourceAccount.account,
                id: base64Encode(
                  `Transfer:["${continuationBlockHash}","0","2","${coinModuleHash}","${transfer.continuation?.pactId}"]`,
                ),
              },
            },
          ],
        });
        expect(finalResponse.transactions.edges[1].node).toEqual({
          result: {
            continuation: `{\"step\":0,\"yield\":{\"data\":{\"amount\":20,\"receiver\":\"${targetAccount.account}\",\"source-chain\":\"0\",\"receiver-guard\":{\"keys\":[\"${targetAccount.keys[0].publicKey}\"],\"pred\":\"keys-all\"}},\"source\":\"0\",\"provenance\":{\"moduleHash\":\"${coinModuleHash}\",\"targetChainId\":\"1\"}},\"pactId\":\"${transfer.continuation?.pactId}\",\"executed\":null,\"stepCount\":2,\"continuation\":{\"def\":\"coin.transfer-crosschain\",\"args\":[\"${sourceAccount.account}\",\"${targetAccount.account}\",{\"keys\":[\"${targetAccount.keys[0].publicKey}\"],\"pred\":\"keys-all\"},\"1\",20]},\"stepHasRollback\":false}`,
            gas: 621,
            eventCount: 4,
          },
          cmd: {
            meta: {
              gasLimit: 2500,
              gasPrice: 1e-8,
              sender: sourceAccount.account,
              ttl: 28800,
              chainId: 0,
            },
            payload: {
              code: `"(coin.transfer-crosschain \\"${sourceAccount.account}\\" \\"${targetAccount.account}\\" (read-keyset \\"account-guard\\") \\"1\\" ${transferAmount}.0)"`,
              data: `{"account-guard":{"keys":["${targetAccount.keys[0].publicKey}"],"pred":"keys-all"}}`,
            },
            signers: [
              {
                capabilities: `[{"args":["${sourceAccount.account}","${targetAccount.account}",{"decimal":"20"},"1"],"name":"coin.TRANSFER_XCHAIN"},{"args":[],"name":"coin.GAS"}]`,
                publicKey: sourceAccount.keys[0].publicKey,
                requestKey: transfer.continuation?.pactId,
                id: base64Encode(
                  `Signer:["${transfer.continuation?.pactId}","0"]`,
                ),
              },
            ],
          },
          hash: transfer.continuation?.pactId,
          id: base64Encode(
            `Transaction:["${continuationBlockHash}","${transfer.continuation?.pactId}"]`,
          ),

          transfers: [
            {
              amount: 0.00000621,
              chainId: 0,
              receiverAccount: devnetMiner.account,
              requestKey: transfer.continuation?.pactId,
              senderAccount: sourceAccount.account,
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
              senderAccount: sourceAccount.account,
              id: base64Encode(
                `Transfer:["${continuationBlockHash}","0","2","${coinModuleHash}","${transfer.continuation?.pactId}"]`, // feels like this should not be the continuation block has and pactId
              ),
              crossChainTransfer: {
                amount: 20,
                blockHash: transfer.metaData?.blockHash,
                chainId: 1,
                moduleName: 'coin',
                receiverAccount: targetAccount.account,
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
              parameterText: `["${sourceAccount.account}","${devnetMiner.account}",6.21e-6]`,
              id: base64Encode(
                `Event:["${continuationBlockHash}","0","${transfer.continuation?.pactId}"]`,
              ),
            },
            {
              requestKey: transfer.continuation?.pactId,
              parameterText: `["${sourceAccount.account}","${targetAccount.account}",20,"1"]`,
              id: base64Encode(
                `Event:["${continuationBlockHash}","1","${transfer.continuation?.pactId}"]`,
              ),
            },
            {
              requestKey: transfer.continuation?.pactId,
              parameterText: `["${sourceAccount.account}","",20]`,
              id: base64Encode(
                `Event:["${continuationBlockHash}","2","${transfer.continuation?.pactId}"]`,
              ),
            },
            {
              requestKey: transfer.continuation?.pactId,
              parameterText: `["1","coin.transfer-crosschain",["${sourceAccount.account}","${targetAccount.account}",{"keys":["${targetAccount.keys[0].publicKey}"],"pred":"keys-all"},"1",20]]`,
              id: base64Encode(
                `Event:["${continuationBlockHash}","3","${transfer.continuation?.pactId}"]`,
              ),
            },
          ],
        });
      }).toPass({
        timeout: 6000,
      });
    });
  });
});
