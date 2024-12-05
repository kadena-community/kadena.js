import { describe, expect, test } from 'vitest';
import { parseGqlTransfers } from '../../services/graphql/transfer.util';
import type { ITransfer } from '../interface';

const TRANSFER_XCHAIN_SEND = [
  {
    amount: 0.1,
    chainId: 0,
    orderIndex: 2,
    receiverAccount: '',
    requestKey: 'O_aVIQ4udkqoocBgLT2WzJ8LPlLaSJ5eTJ4eONLEBW0',
    senderAccount:
      'k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946',
    block: {
      creationTime: '2024-09-12T10:00:58.767Z',
      height: 4638178,
      hash: 'PSjGxqGz-R9oM06MxXZKTKhNT79DlzZSCwE7842y20E',
    },
    transaction: {
      result: {
        __typename: 'TransactionResult',
        goodResult:
          '{"amount":0.1,"receiver":"k:58aa1853a0c1e53997c076ff9f274423f9f7548a1c22ea3210af3afeadc557e3","source-chain":"0","receiver-guard":{"keys":["58aa1853a0c1e53997c076ff9f274423f9f7548a1c22ea3210af3afeadc557e3"],"pred":"keys-all"}}',
        badResult: null,
        events: {
          edges: [
            {
              node: {
                name: 'TRANSFER',
                parameters:
                  '["k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946","k:4ba39bd19b9f3ecae0f03375f9bbe370b66e0101f1ffce5dbff0f3e9f9290967",0.00000619]',
              },
            },
            {
              node: {
                name: 'TRANSFER_XCHAIN',
                parameters:
                  '["k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946","k:58aa1853a0c1e53997c076ff9f274423f9f7548a1c22ea3210af3afeadc557e3",0.1,"1"]',
              },
            },
            {
              node: {
                name: 'TRANSFER',
                parameters:
                  '["k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946","",0.1]',
              },
            },
            {
              node: {
                name: 'X_YIELD',
                parameters:
                  '["1","coin.transfer-crosschain",["k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946","k:58aa1853a0c1e53997c076ff9f274423f9f7548a1c22ea3210af3afeadc557e3",{"keys":["58aa1853a0c1e53997c076ff9f274423f9f7548a1c22ea3210af3afeadc557e3"],"pred":"keys-all"},"1",0.1]]',
              },
            },
          ],
        },
      },
      cmd: {
        networkId: 'testnet04',
        payload: {
          __typename: 'ExecutionPayload',
          code: '"(coin.transfer-crosschain \\"k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946\\" \\"k:58aa1853a0c1e53997c076ff9f274423f9f7548a1c22ea3210af3afeadc557e3\\" (read-keyset \\"ks\\") \\"1\\" 0.100000000000)"',
          data: '{"ks":{"keys":["58aa1853a0c1e53997c076ff9f274423f9f7548a1c22ea3210af3afeadc557e3"],"pred":"keys-all"}}',
        },
        signers: [
          {
            clist: [
              {
                name: 'coin.TRANSFER_XCHAIN',
                args: '["k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946","k:58aa1853a0c1e53997c076ff9f274423f9f7548a1c22ea3210af3afeadc557e3",{"decimal":"0.1"},"1"]',
              },
              {
                name: 'coin.GAS',
                args: '[]',
              },
            ],
          },
        ],
      },
    },
    crossChainTransfer: {
      amount: 0.1,
      chainId: 1,
      orderIndex: 1,
      receiverAccount:
        'k:58aa1853a0c1e53997c076ff9f274423f9f7548a1c22ea3210af3afeadc557e3',
      requestKey: 'uuvAl9AOvSYGBNaHSELdaNoXn--WqdQckx6CF9CnPkY',
      senderAccount: '',
      block: {
        creationTime: '2024-09-19T08:05:56.430Z',
        height: 4658097,
        hash: '_4USRyVnOr29CjYLP8Yv0xFc07GrynYCQ_XJJ_U7Z48',
      },
      transaction: {
        result: {
          __typename: 'TransactionResult',
          goodResult: '"Write succeeded"',
          badResult: null,
          events: {
            edges: [
              {
                node: {
                  name: 'TRANSFER',
                  parameters:
                    '["k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946","k:db776793be0fcf8e76c75bdb35a36e67f298111dc6145c66693b0133192e2616",0.00000472]',
                },
              },
              {
                node: {
                  name: 'TRANSFER',
                  parameters:
                    '["","k:58aa1853a0c1e53997c076ff9f274423f9f7548a1c22ea3210af3afeadc557e3",0.1]',
                },
              },
              {
                node: {
                  name: 'TRANSFER_XCHAIN_RECD',
                  parameters:
                    '["","k:58aa1853a0c1e53997c076ff9f274423f9f7548a1c22ea3210af3afeadc557e3",0.1,"0"]',
                },
              },
              {
                node: {
                  name: 'X_RESUME',
                  parameters:
                    '["0","coin.transfer-crosschain",["k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946","k:58aa1853a0c1e53997c076ff9f274423f9f7548a1c22ea3210af3afeadc557e3",{"keys":["58aa1853a0c1e53997c076ff9f274423f9f7548a1c22ea3210af3afeadc557e3"],"pred":"keys-all"},"1",0.1]]',
                },
              },
            ],
          },
        },
        cmd: {
          networkId: 'testnet04',
          payload: {
            __typename: 'ContinuationPayload',
            step: 1,
            pactId: 'O_aVIQ4udkqoocBgLT2WzJ8LPlLaSJ5eTJ4eONLEBW0',
          },
          signers: [
            {
              clist: [
                {
                  name: 'coin.GAS',
                  args: '[]',
                },
              ],
            },
          ],
        },
      },
    },
  },
  {
    amount: 0.00000619,
    chainId: 0,
    orderIndex: 0,
    receiverAccount:
      'k:4ba39bd19b9f3ecae0f03375f9bbe370b66e0101f1ffce5dbff0f3e9f9290967',
    requestKey: 'O_aVIQ4udkqoocBgLT2WzJ8LPlLaSJ5eTJ4eONLEBW0',
    senderAccount:
      'k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946',
    block: {
      creationTime: '2024-09-12T10:00:58.767Z',
      height: 4638178,
      hash: 'PSjGxqGz-R9oM06MxXZKTKhNT79DlzZSCwE7842y20E',
    },
    crossChainTransfer: null,
    transaction: {
      result: {
        __typename: 'TransactionResult',
        goodResult:
          '{"amount":0.1,"receiver":"k:58aa1853a0c1e53997c076ff9f274423f9f7548a1c22ea3210af3afeadc557e3","source-chain":"0","receiver-guard":{"keys":["58aa1853a0c1e53997c076ff9f274423f9f7548a1c22ea3210af3afeadc557e3"],"pred":"keys-all"}}',
        badResult: null,
        events: {
          edges: [
            {
              node: {
                name: 'TRANSFER',
                parameters:
                  '["k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946","k:4ba39bd19b9f3ecae0f03375f9bbe370b66e0101f1ffce5dbff0f3e9f9290967",0.00000619]',
              },
            },
            {
              node: {
                name: 'TRANSFER_XCHAIN',
                parameters:
                  '["k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946","k:58aa1853a0c1e53997c076ff9f274423f9f7548a1c22ea3210af3afeadc557e3",0.1,"1"]',
              },
            },
            {
              node: {
                name: 'TRANSFER',
                parameters:
                  '["k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946","",0.1]',
              },
            },
            {
              node: {
                name: 'X_YIELD',
                parameters:
                  '["1","coin.transfer-crosschain",["k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946","k:58aa1853a0c1e53997c076ff9f274423f9f7548a1c22ea3210af3afeadc557e3",{"keys":["58aa1853a0c1e53997c076ff9f274423f9f7548a1c22ea3210af3afeadc557e3"],"pred":"keys-all"},"1",0.1]]',
              },
            },
          ],
        },
      },
      cmd: {
        networkId: 'testnet04',
        payload: {
          __typename: 'ExecutionPayload',
          code: '"(coin.transfer-crosschain \\"k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946\\" \\"k:58aa1853a0c1e53997c076ff9f274423f9f7548a1c22ea3210af3afeadc557e3\\" (read-keyset \\"ks\\") \\"1\\" 0.100000000000)"',
          data: '{"ks":{"keys":["58aa1853a0c1e53997c076ff9f274423f9f7548a1c22ea3210af3afeadc557e3"],"pred":"keys-all"}}',
        },
        signers: [
          {
            clist: [
              {
                name: 'coin.TRANSFER_XCHAIN',
                args: '["k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946","k:58aa1853a0c1e53997c076ff9f274423f9f7548a1c22ea3210af3afeadc557e3",{"decimal":"0.1"},"1"]',
              },
              {
                name: 'coin.GAS',
                args: '[]',
              },
            ],
          },
        ],
      },
    },
  },
] as any[];

describe('getTransfers', () => {
  test('Maps a complete cross chain transfer correctly', () => {
    const result = parseGqlTransfers(
      TRANSFER_XCHAIN_SEND,
      0,
      'k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946',
      'coin',
    );
    expect(result).toEqual([
      {
        amount: 0.1,
        chainId: '0',
        targetChainId: '1',
        requestKey: 'O_aVIQ4udkqoocBgLT2WzJ8LPlLaSJ5eTJ4eONLEBW0',
        senderAccount:
          'k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946',
        receiverAccount:
          'k:58aa1853a0c1e53997c076ff9f274423f9f7548a1c22ea3210af3afeadc557e3',
        isCrossChainTransfer: true,
        success: true,
        token: 'coin',
        networkId: 'testnet04',
        block: {
          creationTime: new Date('2024-09-12T10:00:58.767Z'),
          blockDepthEstimate: 0,
          hash: 'PSjGxqGz-R9oM06MxXZKTKhNT79DlzZSCwE7842y20E',
          height: 4638178,
        },
        continuation: {
          requestKey: 'uuvAl9AOvSYGBNaHSELdaNoXn--WqdQckx6CF9CnPkY',
          success: true,
        },
        transactionFeeTransfer: {
          amount: 0.00000619,
          block: {
            blockDepthEstimate: 0,
            creationTime: new Date('2024-09-12T10:00:58.767Z'),
            hash: 'PSjGxqGz-R9oM06MxXZKTKhNT79DlzZSCwE7842y20E',
            height: 4638178,
          },
          chainId: '0',
          isBulkTransfer: false,
          isCrossChainTransfer: false,
          networkId: 'testnet04',
          receiverAccount:
            'k:4ba39bd19b9f3ecae0f03375f9bbe370b66e0101f1ffce5dbff0f3e9f9290967',
          requestKey: 'O_aVIQ4udkqoocBgLT2WzJ8LPlLaSJ5eTJ4eONLEBW0',
          senderAccount:
            'k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946',
          success: true,
          token: 'coin',
        },
      } as ITransfer,
    ]);
  });
});
