import { describe, expect, it } from 'vitest';

import { transferCreateCommand } from '../coin';

import { composePactCommand, setNetworkId } from '@kadena/client/fp';
import { estimateGas } from '../core/estimate-gas';
import {
  sender00Account,
  sourceAccount,
  targetAccount,
} from './test-data/accounts';

const accountOne = {
  ...sourceAccount,
  account: `one-${Date.now()}`,
};
const accountTwo = {
  ...targetAccount,
  account: `two-${Date.now()}`,
};

describe('estimateGas', () => {
  it('should return gasLimit and gasPrice', async () => {
    const result = await estimateGas(
      composePactCommand(
        transferCreateCommand({
          sender: {
            account: sender00Account.account,
            publicKeys: [sender00Account.publicKey],
          },
          receiver: {
            account: accountOne.account,
            keyset: {
              keys: [accountOne.publicKey],
              pred: 'keys-all',
            },
          },
          amount: '1',
          chainId: '0',
        }),
        setNetworkId('fast-development'),
      ),
      'http://127.0.0.1:8080',
    );

    expect(result).toEqual({ gasLimit: 708, gasPrice: 1e-8 });
  });
});
