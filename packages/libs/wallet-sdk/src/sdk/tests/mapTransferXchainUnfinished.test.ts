import { describe, expect, test } from 'vitest';
import { parseGqlTransfers } from '../../services/graphql/transfer.util';
import type { ITransfer } from '../interface';

const TRANSFER_XCHAIN_SEND = [
  {
    amount: 0.00000619,
    chainId: 0,
    orderIndex: 0,
    receiverAccount:
      'k:db776793be0fcf8e76c75bdb35a36e67f298111dc6145c66693b0133192e2616',
    requestKey: 'FVw93gHbAURTTI74-gbwvTY8AQFA7pd9mfr6obB8SMY',
    senderAccount:
      'k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946',
    block: {
      creationTime: '2024-09-30T10:08:39.033Z',
      height: 4690009,
      hash: 'yJjKVagCvIkrQXvJwciIb-m-O_yjPDCaPliHQpgXGdo',
    },
    crossChainTransfer: null,
    transaction: {
      result: {
        __typename: 'TransactionResult',
        goodResult:
          '{"amount":0.1,"receiver":"k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946","source-chain":"0","receiver-guard":{"keys":["2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946"],"pred":"keys-all"}}',
        badResult: null,
        events: {
          edges: [
            {
              node: {
                name: 'TRANSFER',
                parameters:
                  '["k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946","k:db776793be0fcf8e76c75bdb35a36e67f298111dc6145c66693b0133192e2616",0.00000619]',
              },
            },
            {
              node: {
                name: 'TRANSFER_XCHAIN',
                parameters:
                  '["k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946","k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946",0.1,"1"]',
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
                  '["1","coin.transfer-crosschain",["k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946","k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946",{"keys":["2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946"],"pred":"keys-all"},"1",0.1]]',
              },
            },
          ],
        },
      },
      cmd: {
        networkId: 'testnet04',
        payload: {
          __typename: 'ExecutionPayload',
          code: '"(coin.transfer-crosschain \\"k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946\\" \\"k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946\\" (read-keyset \\"ks\\") \\"1\\" 0.100000000000)"',
          data: '{"ks":{"keys":["2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946"],"pred":"keys-all"}}',
        },
        signers: [
          {
            clist: [
              {
                name: 'coin.TRANSFER_XCHAIN',
                args: '["k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946","k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946",{"decimal":"0.1"},"1"]',
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
  {
    amount: 0.1,
    chainId: 0,
    orderIndex: 2,
    receiverAccount: '',
    requestKey: 'FVw93gHbAURTTI74-gbwvTY8AQFA7pd9mfr6obB8SMY',
    senderAccount:
      'k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946',
    block: {
      creationTime: '2024-09-30T10:08:39.033Z',
      height: 4690009,
      hash: 'yJjKVagCvIkrQXvJwciIb-m-O_yjPDCaPliHQpgXGdo',
    },
    crossChainTransfer: null,
    transaction: {
      result: {
        __typename: 'TransactionResult',
        goodResult:
          '{"amount":0.1,"receiver":"k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946","source-chain":"0","receiver-guard":{"keys":["2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946"],"pred":"keys-all"}}',
        badResult: null,
        events: {
          edges: [
            {
              node: {
                name: 'TRANSFER',
                parameters:
                  '["k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946","k:db776793be0fcf8e76c75bdb35a36e67f298111dc6145c66693b0133192e2616",0.00000619]',
              },
            },
            {
              node: {
                name: 'TRANSFER_XCHAIN',
                parameters:
                  '["k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946","k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946",0.1,"1"]',
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
                  '["1","coin.transfer-crosschain",["k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946","k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946",{"keys":["2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946"],"pred":"keys-all"},"1",0.1]]',
              },
            },
          ],
        },
      },
      cmd: {
        networkId: 'testnet04',
        payload: {
          __typename: 'ExecutionPayload',
          code: '"(coin.transfer-crosschain \\"k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946\\" \\"k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946\\" (read-keyset \\"ks\\") \\"1\\" 0.100000000000)"',
          data: '{"ks":{"keys":["2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946"],"pred":"keys-all"}}',
        },
        signers: [
          {
            clist: [
              {
                name: 'coin.TRANSFER_XCHAIN',
                args: '["k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946","k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946",{"decimal":"0.1"},"1"]',
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
  test('Maps a not-complete cross chain transfer start correctly', () => {
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
        requestKey: 'FVw93gHbAURTTI74-gbwvTY8AQFA7pd9mfr6obB8SMY',
        senderAccount:
          'k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946',
        receiverAccount:
          'k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946',
        isCrossChainTransfer: true,
        success: true,
        token: 'coin',
        networkId: 'testnet04',
        block: {
          creationTime: new Date('2024-09-30T10:08:39.033Z'),
          blockDepthEstimate: -4690012,
          hash: 'yJjKVagCvIkrQXvJwciIb-m-O_yjPDCaPliHQpgXGdo',
          height: 4690009,
        },
        transactionFeeTransfer: {
          amount: 0.00000619,
          block: {
            blockDepthEstimate: -4690012,
            creationTime: new Date('2024-09-30T10:08:39.033Z'),
            hash: 'yJjKVagCvIkrQXvJwciIb-m-O_yjPDCaPliHQpgXGdo',
            height: 4690009,
          },
          chainId: '0',
          isBulkTransfer: false,
          isCrossChainTransfer: false,
          networkId: 'testnet04',
          receiverAccount:
            'k:db776793be0fcf8e76c75bdb35a36e67f298111dc6145c66693b0133192e2616',
          requestKey: 'FVw93gHbAURTTI74-gbwvTY8AQFA7pd9mfr6obB8SMY',
          senderAccount:
            'k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946',
          success: true,
          token: 'coin',
        },
      } as ITransfer,
    ]);
  });
});
