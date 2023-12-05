import request from 'supertest';
import { beforeEach, describe, expect, test } from 'vitest';
import {
  createAccount,
  generateAccount,
  transferFunds,
} from '../../utils/account-utils';
import type { IAccountWithSecretKey } from '../../testdata/constants/accounts';
import { grapHost } from '../../testdata/constants/network';
import { getTransfersQuery } from '../../testdata/queries/getTransfers';

let sourceAccount: IAccountWithSecretKey;
let targetAccount: IAccountWithSecretKey;

describe('Transfers', () => {
  beforeEach(async () => {
    sourceAccount = await generateAccount();
    targetAccount = await generateAccount();
  });

  test.skip('Query: getTransfers by AccountName', async () => {
    // Given two test acounts are created and a transfer is performed from the source account to the target account.
    const sourceResponse = await createAccount(sourceAccount);
    const targetResponse = await createAccount(targetAccount);
    const transferResponse = await transferFunds(
      sourceAccount,
      targetAccount,
      '20',
      '0',
    );

    // When the getTransfersQuery is executed
    const query = getTransfersQuery(sourceAccount.account);
    const queryResponse = await request(grapHost).post('').send(query);
    console.log(queryResponse.body.data);
    //Then GraphQL should return the account, including 1 transfer.
    expect(queryResponse.statusCode).toBe(200);

    expect(queryResponse.body.data.transfers.edges[0]).toMatchObject({
      // This is the Gas Payment of the transfer.
      cursor: expect.any(String),
      node: {
        amount: 0.00000736,
        blockHash: expect.any(String),
        chainId: 0,
        height: expect.any(Number),
        moduleHash: expect.any(String),
        moduleName: 'coin',
        orderIndex: 0,
        receiverAccount: targetAccount.account,
        requestKey: expect.any(String),
        senderAccount: sourceAccount.account,
        id: expect.any(String),
        transaction: {
          badResult: null,
          code: `"(coin.transfer \\"${sourceAccount.account}\\" \\"${targetAccount.account}\\" 20.0)"`,
          chainId: 0,
          continuation: null,
          data: '{}',
          creationTime: expect.any(Date),
          eventCount: 2,
          gas: 736,
          gasPrice: 1e-8,
          gasLimit: 2500,
          height: expect.any(Number),
          goodResult: '"Write succeeded"',
          logs: expect.any(String),
          metadata: null,
          nonce: expect.any(String),
          pactId: null,
          proof: null,
          requestKey: expect.any(String),
          rollback: null,
          senderAccount: sourceAccount.account,
          step: null,
          transactionId: 140,
          ttl: 28800,
          id: expect.any(String),
          signers: [
            expect.objectContaining({
              address: null,
              capabilities: `[{"args":["${sourceAccount.account}","${targetAccount.account}",{"decimal":"20"}],"name":"coin.TRANSFER"},{"args":[],"name":"coin.GAS"}]`,
              orderIndex: 0,
              publicKey: sourceAccount.publicKey,
              scheme: 'ED25519',
            }),
          ],
        },
      },
    });
    // expect(queryResponse.body.data).toMatchObject({
    //   transfers: {
    //     totalCount: 3,
    //     edges: [
    //       {
    //         // This is the Gas Payment of the transfer.
    //         cursor: expect.any(String),
    //         node: {
    //           amount: 0.00000736,
    //           blockHash: expect.any(String),
    //           chainId: 0,
    //           height: 85,
    //           moduleHash: expect.any(String),
    //           moduleName: 'coin',
    //           orderIndex: 0,
    //           receiverAccount: targetAccount.account,
    //           requestKey: expect.any(String),
    //           senderAccount: sourceAccount.account,
    //           id: expect.any(String),
    //           transaction: {
    //             badResult: null,
    //             code: `"(coin.transfer \\"${sourceAccount.account}\\" \\"${targetAccount.account}\\" 20.0)"`,
    //             chainId: 0,
    //             continuation: null,
    //             data: '{}',
    //             creationTime: expect.any(Date),
    //             eventCount: 2,
    //             gas: 736,
    //             gasPrice: 1e-8,
    //             gasLimit: 2500,
    //             height: expect.any(Number),
    //             goodResult: '"Write succeeded"',
    //             logs: expect.any(String),
    //             metadata: null,
    //             nonce: expect.any(String),
    //             pactId: null,
    //             proof: null,
    //             requestKey: expect.any(String),
    //             rollback: null,
    //             senderAccount: sourceAccount.account,
    //             step: null,
    //             transactionId: 140,
    //             ttl: 28800,
    //             id: expect.any(String),
    //             signers: [
    //               {
    //                 address: null,
    //                 capabilities: `[{"args":["${sourceAccount.account}","${targetAccount.account}",{"decimal":"20"}],"name":"coin.TRANSFER"},{"args":[],"name":"coin.GAS"}]`,
    //                 orderIndex: 0,
    //                 publicKey: sourceAccount.publicKey,
    //                 requestKey: expect.any(String),
    //                 scheme: 'ED25519',
    //                 signature:
    //                   '652f998b730761365333b5145b77cbb4d9388d6b601239e8581cd84ef9300ce724c7ff48f07457e7a53a8ce6e59359ac866f1f484e0a98d10b7c40efd4cc630a',
    //                 id: 'U2lnbmVyOlsidk1nd0JuZFNSS1M1ZEc5QUlwVVJQZnNoZ0FxX3RpSUwwUnNaa0tTYUdDbyIsIjAiXQ==',
    //               },
    //             ],
    //           },
    //         },
    //       },
    //       // expect.objectContaining({
    //       //   // This is the transfer of funds from source to target.
    //       //   cursor:
    //       //     'R1BDOko6WyJ5VGgyZ2ltSktyTVdEZ1JyZzhpRHBmRTJVRVItV09heWRqa2ZnRklXeFdVIiwwLDEsIk0xZ2FiYWtxa0VpXzFOOGRSS3Q0ejVsRXYxa3VDX254TFRueURDdVpJSzAiLCJ2TWd3Qm5kU1JLUzVkRzlBSXBVUlBmc2hnQXFfdGlJTDBSc1prS1NhR0NvIl0=',
    //       //   node: {
    //       //     amount: 20,
    //       //     blockHash: 'yTh2gimJKrMWDgRrg8iDpfE2UER-WOaydjkfgFIWxWU',
    //       //     chainId: 0,
    //       //     height: 85,
    //       //     moduleHash: 'M1gabakqkEi_1N8dRKt4z5lEv1kuC_nxLTnyDCuZIK0',
    //       //     moduleName: 'coin',
    //       //     orderIndex: 1,
    //       //     receiverAccount:
    //       //       'k:97c5e4631fd9ab69d457c612d0d929a3242631abfb47ada22829697dee750b45',
    //       //     requestKey: 'vMgwBndSRKS5dG9AIpURPfshgAq_tiIL0RsZkKSaGCo',
    //       //     senderAccount: sourceAccount.account,
    //       //     id: 'VHJhbnNmZXI6WyJ5VGgyZ2ltSktyTVdEZ1JyZzhpRHBmRTJVRVItV09heWRqa2ZnRklXeFdVIiwiMCIsIjEiLCJNMWdhYmFrcWtFaV8xTjhkUkt0NHo1bEV2MWt1Q19ueExUbnlEQ3VaSUswIiwidk1nd0JuZFNSS1M1ZEc5QUlwVVJQZnNoZ0FxX3RpSUwwUnNaa0tTYUdDbyJd',
    //       //     transaction: {
    //       //       badResult: null,
    //       //       code: `"(coin.transfer \\"${sourceAccount.account}\\" \\"${targetAccount.account}\\" 20.0)"`,
    //       //       chainId: 0,
    //       //       continuation: null,
    //       //       data: '{}',
    //       //       creationTime: '2023-12-04T13:22:19.000Z',
    //       //       eventCount: 2,
    //       //       gas: 736,
    //       //       gasPrice: 1e-8,
    //       //       gasLimit: 2500,
    //       //       height: 85,
    //       //       goodResult: '"Write succeeded"',
    //       //       logs: 'wIrursGc4s05qQAWui-FHIvb9_7_qat8_iel1iFqg0w',
    //       //       metadata: null,
    //       //       nonce: 'kjs:nonce:1701696139132',
    //       //       pactId: null,
    //       //       proof: null,
    //       //       requestKey: 'vMgwBndSRKS5dG9AIpURPfshgAq_tiIL0RsZkKSaGCo',
    //       //       rollback: null,
    //       //       senderAccount: sourceAccount.account,
    //       //       step: null,
    //       //       transactionId: 140,
    //       //       ttl: 28800,
    //       //       id: 'VHJhbnNhY3Rpb246WyJ5VGgyZ2ltSktyTVdEZ1JyZzhpRHBmRTJVRVItV09heWRqa2ZnRklXeFdVIiwidk1nd0JuZFNSS1M1ZEc5QUlwVVJQZnNoZ0FxX3RpSUwwUnNaa0tTYUdDbyJd',
    //       //       signers: [
    //       //         {
    //       //           address: null,
    //       //           capabilities: `[{"args":["${sourceAccount.account}","${targetAccount.account}",{"decimal":"20"}],"name":"coin.TRANSFER"},{"args":[],"name":"coin.GAS"}]`,
    //       //           orderIndex: 0,
    //       //           publicKey:
    //       //            sourceAccount.publicKey,
    //       //           requestKey: 'vMgwBndSRKS5dG9AIpURPfshgAq_tiIL0RsZkKSaGCo',
    //       //           scheme: 'ED25519',
    //       //           signature:
    //       //             '652f998b730761365333b5145b77cbb4d9388d6b601239e8581cd84ef9300ce724c7ff48f07457e7a53a8ce6e59359ac866f1f484e0a98d10b7c40efd4cc630a',
    //       //           id: 'U2lnbmVyOlsidk1nd0JuZFNSS1M1ZEc5QUlwVVJQZnNoZ0FxX3RpSUwwUnNaa0tTYUdDbyIsIjAiXQ==',
    //       //         },
    //       //       ],
    //       //     },
    //       //   },
    //       // }),
    //       // expect.objectContaining({
    //       //   // This the initial creation of the source Account.
    //       //   cursor:
    //       //     'R1BDOko6WyJFNXo1SmMtU1pmMVhmeDhaOUo5TE45dDJFZ3JrV3VYMi1rT2NDZU5PaHN3IiwwLDEsIk0xZ2FiYWtxa0VpXzFOOGRSS3Q0ejVsRXYxa3VDX254TFRueURDdVpJSzAiLCJHZmNZWGxmRjZ0VWV0RzF1MENGWlJTODZZb2xuWkJvaHFJeVhIQW1QMndjIl0=',
    //       //   node: {
    //       //     amount: 100,
    //       //     blockHash: 'E5z5Jc-SZf1Xfx8Z9J9LN9t2EgrkWuX2-kOcCeNOhsw',
    //       //     chainId: 0,
    //       //     height: 81,
    //       //     moduleHash: 'M1gabakqkEi_1N8dRKt4z5lEv1kuC_nxLTnyDCuZIK0',
    //       //     moduleName: 'coin',
    //       //     orderIndex: 1,
    //       //     receiverAccount: sourceAccount.account,
    //       //     requestKey: sourceResponse.reqKey,
    //       //     senderAccount: sender00.account,
    //       //     id: 'VHJhbnNmZXI6WyJFNXo1SmMtU1pmMVhmeDhaOUo5TE45dDJFZ3JrV3VYMi1rT2NDZU5PaHN3IiwiMCIsIjEiLCJNMWdhYmFrcWtFaV8xTjhkUkt0NHo1bEV2MWt1Q19ueExUbnlEQ3VaSUswIiwiR2ZjWVhsZkY2dFVldEcxdTBDRlpSUzg2WW9sblpCb2hxSXlYSEFtUDJ3YyJd',
    //       //     transaction: {
    //       //       badResult: null,
    //       //       code: `"(coin.transfer-create \\"${sender00.account}\\" \\"${sourceAccount.account}\\" (read-keyset \\"account-guard\\") 100.0)"`,
    //       //       chainId: 0,
    //       //       continuation: null,
    //       //       data: `{"account-guard":{"keys":["${sourceAccount.publicKey}"],"pred":"keys-all"}}`,
    //       //       creationTime: '2023-12-04T13:22:03.000Z',
    //       //       eventCount: 2,
    //       //       gas: 705,
    //       //       gasPrice: 1e-8,
    //       //       gasLimit: 2500,
    //       //       height: 81,
    //       //       goodResult: '"Write succeeded"',
    //       //       logs: 'w0CWUgFRFk0cS9viCFBjwr4RStCsh70DjxMszBxdEVY',
    //       //       metadata: null,
    //       //       nonce: 'kjs:nonce:1701696123911',
    //       //       pactId: null,
    //       //       proof: null,
    //       //       requestKey: sourceResponse.reqKey,
    //       //       rollback: null,
    //       //       senderAccount: sender00.account,
    //       //       step: null,
    //       //       transactionId: expect.any(Number),
    //       //       ttl: 28800,
    //       //       id: 'VHJhbnNhY3Rpb246WyJFNXo1SmMtU1pmMVhmeDhaOUo5TE45dDJFZ3JrV3VYMi1rT2NDZU5PaHN3IiwiR2ZjWVhsZkY2dFVldEcxdTBDRlpSUzg2WW9sblpCb2hxSXlYSEFtUDJ3YyJd',
    //       //       signers: [
    //       //         {
    //       //           address: null,
    //       //           capabilities:
    //       //             `[{"args":["${sender00.account}","${sourceAccount.account}",{"decimal":"100"}],"name":"coin.TRANSFER"},{"args":[],"name":"coin.GAS"}]`,
    //       //           orderIndex: 0,
    //       //           publicKey:
    //       //             sender00.publicKey,
    //       //           requestKey: expect.any(String),
    //       //           scheme: 'ED25519',
    //       //           signature:expect.any(String),
    //       //           id: expect.any(String),
    //       //         },
    //       //       ],
    //       //     },
    //       //   },
    //       // }),
    //     ],
    //   },
    // });
  });
});
