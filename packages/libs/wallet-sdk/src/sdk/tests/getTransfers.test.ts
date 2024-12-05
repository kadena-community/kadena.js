import { describe, expect, test } from 'vitest';
import { walletSdk } from '../walletSdk.js';

describe('getTransfers', () => {
  test('runs', async () => {
    const result = await walletSdk.getTransfers({
      accountName:
        'k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946',
      networkId: 'testnet04',
    });
    // console.log(result);

    const transfer = result.transfers.filter(
      (x) => x.requestKey === 'FVw93gHbAURTTI74-gbwvTY8AQFA7pd9mfr6obB8SMY',
    );
    console.log(transfer);
    expect(transfer).toEqual([
      {
        amount: 0.1,
        chainId: '0',
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
          blockDepthEstimate: transfer[0].block.blockDepthEstimate,
          creationTime: new Date('2024-09-30T10:08:39.033Z'),
          hash: 'yJjKVagCvIkrQXvJwciIb-m-O_yjPDCaPliHQpgXGdo',
          height: 4690009,
        },
        transactionFeeTransfer: {
          amount: 0.00000619,
          chainId: '0',
          requestKey: 'FVw93gHbAURTTI74-gbwvTY8AQFA7pd9mfr6obB8SMY',
          senderAccount:
            'k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946',
          receiverAccount:
            'k:db776793be0fcf8e76c75bdb35a36e67f298111dc6145c66693b0133192e2616',
          isCrossChainTransfer: false,
          success: true,
          token: 'coin',
          networkId: 'testnet04',
          block: {
            blockDepthEstimate: transfer[0].block.blockDepthEstimate,
            creationTime: new Date('2024-09-30T10:08:39.033Z'),
            hash: 'yJjKVagCvIkrQXvJwciIb-m-O_yjPDCaPliHQpgXGdo',
            height: 4690009,
          },
          isBulkTransfer: false,
        },
        targetChainId: '1',
      },
    ]);

    const transfer2 = result.transfers.filter(
      (x) => x.requestKey === 'KeasLpaJQUUAB_ROeHChuv-yW8hmM0NlMKM1ht5nb1k',
    );
    console.log('transfer2', transfer2);
    expect(transfer2).toEqual([
      {
        amount: 0.1,
        chainId: '0',
        requestKey: 'KeasLpaJQUUAB_ROeHChuv-yW8hmM0NlMKM1ht5nb1k',
        senderAccount:
          'k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946',
        receiverAccount:
          'k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946',
        isCrossChainTransfer: true,
        success: true,
        token: 'coin',
        networkId: 'testnet04',
        targetChainId: '1',
        block: {
          blockDepthEstimate: transfer2[0].block.blockDepthEstimate,
          creationTime: new Date('2024-09-12T10:19:13.649Z'),
          hash: '2fFYcGz5Bf1sfPAaLItJXCJR6Qj77jKiaRsMYgIgSRw',
          height: 4638212,
        },
        continuation: {
          requestKey: 'rx3ra-bhdHO2blq9P-iuZYaVLqV61J4IKS6ccMTSNUw',
          success: true,
        },
        transactionFeeTransfer: {
          amount: 0.00000619,
          block: {
            blockDepthEstimate: transfer2[0].block.blockDepthEstimate,
            creationTime: new Date('2024-09-12T10:19:13.649Z'),
            hash: '2fFYcGz5Bf1sfPAaLItJXCJR6Qj77jKiaRsMYgIgSRw',
            height: 4638212,
          },
          chainId: '0',
          isBulkTransfer: false,
          isCrossChainTransfer: false,
          networkId: 'testnet04',
          receiverAccount:
            'k:db776793be0fcf8e76c75bdb35a36e67f298111dc6145c66693b0133192e2616',
          requestKey: 'KeasLpaJQUUAB_ROeHChuv-yW8hmM0NlMKM1ht5nb1k',
          senderAccount:
            'k:2017fee3fb15cfe840e5ed34bf101cc7d5579ffdd20dea09e32fd77c1757f946',
          success: true,
          token: 'coin',
        },
      },
    ]);
  });
});
