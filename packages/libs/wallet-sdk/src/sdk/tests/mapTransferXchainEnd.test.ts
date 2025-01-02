import { describe, expect, test } from 'vitest';
import { parseGqlTransfers } from '../../services/graphql/transfer.util.js';
import type { ITransfer } from '../interface.js';

const GQL_TRANSFER_XCHAIN_FINISH = [
  {
    amount: 0.00000553,
    chainId: 4,
    orderIndex: 0,
    receiverAccount:
      'k:db776793be0fcf8e76c75bdb35a36e67f298111dc6145c66693b0133192e2616',
    requestKey: 'UXkFsj8hFBZ4wNZBqw12HZ7mSlpHqyrg1VP2nfSdR4k',
    senderAccount: 'kadena-xchain-gas',
    moduleName: 'coin',
    crossChainTransfer: null,
    block: {
      hash: 'i4jeD4i8SFI6STZBMoh5p2mYBwFOlnaJBB-HzYCHZLE',
      height: 4678375,
      creationTime: '2024-09-26T09:11:07.288Z',
      minerAccount: {
        accountName:
          'k:db776793be0fcf8e76c75bdb35a36e67f298111dc6145c66693b0133192e2616',
      },
    },
    transaction: {
      result: {
        __typename: 'TransactionResult',
        goodResult: '"Write succeeded"',
        badResult: null,
        gas: 553,
        events: {
          edges: [
            {
              node: {
                name: 'TRANSFER',
                parameters:
                  '["kadena-xchain-gas","k:db776793be0fcf8e76c75bdb35a36e67f298111dc6145c66693b0133192e2616",0.00000553]',
              },
            },
            {
              node: {
                name: 'TRANSFER',
                parameters:
                  '["","k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946",0.1]',
              },
            },
            {
              node: {
                name: 'TRANSFER_XCHAIN_RECD',
                parameters:
                  '["","k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946",0.1,"0"]',
              },
            },
            {
              node: {
                name: 'X_RESUME',
                parameters:
                  '["0","coin.transfer-crosschain",["k:a3429e678ffdd3da937519c3c1db785e21917b395a63e0bb9867b2a3701ca81b","k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946",{"keys":["2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946"],"pred":"keys-all"},"4",0.1]]',
              },
            },
          ],
        },
      },
      cmd: {
        networkId: 'testnet04',
        meta: {
          gasPrice: 1e-8,
          sender: 'kadena-xchain-gas',
        },
        payload: {
          __typename: 'ContinuationPayload',
          step: 1,
          pactId: 'jZo2UQ9f-HtG8n4-MpdW4sQjRMUU5jvYrnLCC1NkYbA',
        },
        signers: [],
      },
    },
  },
  {
    amount: 0.1,
    chainId: 4,
    orderIndex: 1,
    receiverAccount:
      'k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946',
    requestKey: 'UXkFsj8hFBZ4wNZBqw12HZ7mSlpHqyrg1VP2nfSdR4k',
    senderAccount: '',
    moduleName: 'coin',
    block: {
      hash: 'i4jeD4i8SFI6STZBMoh5p2mYBwFOlnaJBB-HzYCHZLE',
      height: 4678375,
      creationTime: '2024-09-26T09:11:07.288Z',
      minerAccount: {
        accountName:
          'k:db776793be0fcf8e76c75bdb35a36e67f298111dc6145c66693b0133192e2616',
      },
    },
    transaction: {
      result: {
        __typename: 'TransactionResult',
        goodResult: '"Write succeeded"',
        badResult: null,
        gas: 553,
        events: {
          edges: [
            {
              node: {
                name: 'TRANSFER',
                parameters:
                  '["kadena-xchain-gas","k:db776793be0fcf8e76c75bdb35a36e67f298111dc6145c66693b0133192e2616",0.00000553]',
              },
            },
            {
              node: {
                name: 'TRANSFER',
                parameters:
                  '["","k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946",0.1]',
              },
            },
            {
              node: {
                name: 'TRANSFER_XCHAIN_RECD',
                parameters:
                  '["","k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946",0.1,"0"]',
              },
            },
            {
              node: {
                name: 'X_RESUME',
                parameters:
                  '["0","coin.transfer-crosschain",["k:a3429e678ffdd3da937519c3c1db785e21917b395a63e0bb9867b2a3701ca81b","k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946",{"keys":["2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946"],"pred":"keys-all"},"4",0.1]]',
              },
            },
          ],
        },
      },
      cmd: {
        networkId: 'testnet04',
        meta: {
          gasPrice: 1e-8,
          sender: 'kadena-xchain-gas',
        },
        payload: {
          __typename: 'ContinuationPayload',
          step: 1,
          pactId: 'jZo2UQ9f-HtG8n4-MpdW4sQjRMUU5jvYrnLCC1NkYbA',
        },
        signers: [],
      },
    },
    crossChainTransfer: {
      amount: 0.1,
      chainId: 0,
      orderIndex: 2,
      receiverAccount: '',
      requestKey: 'jZo2UQ9f-HtG8n4-MpdW4sQjRMUU5jvYrnLCC1NkYbA',
      senderAccount:
        'k:a3429e678ffdd3da937519c3c1db785e21917b395a63e0bb9867b2a3701ca81b',
      moduleName: 'coin',
      block: {
        hash: 'f9iYNde8z07823O2uTL5PE6wNCnw6cfn4m21PZepZHg',
        height: 4638194,
        creationTime: '2024-09-12T10:09:18.577Z',
        minerAccount: {
          accountName:
            'k:db776793be0fcf8e76c75bdb35a36e67f298111dc6145c66693b0133192e2616',
        },
      },
      transaction: {
        result: {
          __typename: 'TransactionResult',
          goodResult:
            '{"amount":0.1,"receiver":"k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946","source-chain":"0","receiver-guard":{"keys":["2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946"],"pred":"keys-all"}}',
          badResult: null,
          gas: 619,
          events: {
            edges: [
              {
                node: {
                  name: 'TRANSFER',
                  parameters:
                    '["k:a3429e678ffdd3da937519c3c1db785e21917b395a63e0bb9867b2a3701ca81b","k:db776793be0fcf8e76c75bdb35a36e67f298111dc6145c66693b0133192e2616",0.00000619]',
                },
              },
              {
                node: {
                  name: 'TRANSFER_XCHAIN',
                  parameters:
                    '["k:a3429e678ffdd3da937519c3c1db785e21917b395a63e0bb9867b2a3701ca81b","k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946",0.1,"4"]',
                },
              },
              {
                node: {
                  name: 'TRANSFER',
                  parameters:
                    '["k:a3429e678ffdd3da937519c3c1db785e21917b395a63e0bb9867b2a3701ca81b","",0.1]',
                },
              },
              {
                node: {
                  name: 'X_YIELD',
                  parameters:
                    '["4","coin.transfer-crosschain",["k:a3429e678ffdd3da937519c3c1db785e21917b395a63e0bb9867b2a3701ca81b","k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946",{"keys":["2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946"],"pred":"keys-all"},"4",0.1]]',
                },
              },
            ],
          },
        },
        cmd: {
          networkId: 'testnet04',
          meta: {
            gasPrice: 1e-8,
            sender:
              'k:a3429e678ffdd3da937519c3c1db785e21917b395a63e0bb9867b2a3701ca81b',
          },
          payload: {
            __typename: 'ExecutionPayload',
            code: '"(coin.transfer-crosschain \\"k:a3429e678ffdd3da937519c3c1db785e21917b395a63e0bb9867b2a3701ca81b\\" \\"k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946\\" (read-keyset \\"ks\\") \\"4\\" 0.100000000000)"',
            data: '{"ks":{"keys":["2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946"],"pred":"keys-all"}}',
          },
          signers: [
            {
              clist: [
                {
                  name: 'coin.TRANSFER_XCHAIN',
                  args: '["k:a3429e678ffdd3da937519c3c1db785e21917b395a63e0bb9867b2a3701ca81b","k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946",{"decimal":"0.1"},"4"]',
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
  },
] as any;

describe('getTransfers', () => {
  test('Maps a cross chain received transfer correctly', () => {
    const result = parseGqlTransfers(
      GQL_TRANSFER_XCHAIN_FINISH,
      BigInt(0),
      'coin',
    );
    expect(result).toEqual([
      {
        amount: 0.1,
        chainId: '0',
        targetChainId: '4',
        requestKey: 'jZo2UQ9f-HtG8n4-MpdW4sQjRMUU5jvYrnLCC1NkYbA',
        senderAccount:
          'k:a3429e678ffdd3da937519c3c1db785e21917b395a63e0bb9867b2a3701ca81b',
        receiverAccount:
          'k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946',
        isCrossChainTransfer: true,
        success: true,
        token: 'coin',
        networkId: 'testnet04',
        block: {
          creationTime: new Date('2024-09-12T10:09:18.577Z'),
          blockDepthEstimate: BigInt(-4638197),
          hash: 'f9iYNde8z07823O2uTL5PE6wNCnw6cfn4m21PZepZHg',
          height: BigInt(4638194),
        },
        continuation: {
          requestKey: 'UXkFsj8hFBZ4wNZBqw12HZ7mSlpHqyrg1VP2nfSdR4k',
          success: true,
        },
        transactionFee: {
          amount: 0.00000553,
          isBulkTransfer: false,
          receiverAccount:
            'k:db776793be0fcf8e76c75bdb35a36e67f298111dc6145c66693b0133192e2616',
          senderAccount: 'kadena-xchain-gas',
        },
      } as ITransfer,
    ]);
  });
});
