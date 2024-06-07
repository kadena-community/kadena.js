import { describe, expect, it } from 'vitest';

import { transferCreate, transferCreateCommand } from '../coin';

import type { IPactCommand } from '@kadena/client';
import { createSignWithKeypair } from '@kadena/client';
import { composePactCommand, setNetworkId } from '@kadena/client/fp';
import { estimateGas } from '../core/estimate-gas';
import { sender00Account, sourceAccount } from './test-data/accounts';

const accountOne = {
  ...sourceAccount,
  account: `utils-one-${Date.now()}`,
};

// const accountTwo = {
//   ...targetAccount,
//   account: `utils-two-${Date.now()}`,
// };

describe('estimateGas', () => {
  it('should return gasLimit and gasPrice', async () => {
    const inputs = {
      sender: {
        account: sender00Account.account,
        publicKeys: [sender00Account.publicKey],
      },
      receiver: {
        account: accountOne.account,
        keyset: {
          keys: [accountOne.publicKey],
          pred: 'keys-all' as const,
        },
      },
      amount: '1',
      chainId: '0' as const,
    };
    const gasEstimation = await estimateGas(
      composePactCommand(
        transferCreateCommand(inputs),
        setNetworkId('development'),
      ),
      'http://127.0.0.1:8080',
    );

    expect(gasEstimation).toEqual({ gasLimit: 707, gasPrice: 1e-8 });

    // check if the gas estimation is correct
    const transferResult = await transferCreate(inputs, {
      defaults: {
        networkId: 'development',
        meta: { ...gasEstimation } as IPactCommand['meta'],
      },
      host: 'http://127.0.0.1:8080',
      sign: createSignWithKeypair([sender00Account]),
    }).execute();

    expect(transferResult).toEqual('Write succeeded');
  });
});
