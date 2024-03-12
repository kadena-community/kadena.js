import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPactCommandFromTransaction } from '../deploy-contract';
import { contractCode, input } from './test-data';

describe('createPactCommand', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(new Date('2023-10-26'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return a pact command with the correct structure', async () => {
    const command = createPactCommandFromTransaction({
      contractCode,
      transactionBody: input,
    });

    console.log(command);
    expect(command).toEqual({
      payload: {
        exec: {
          code: '(+ 1 1)',
          data: {
            'test-key': 'test-value',
            'test-keyset': {
              keys: [
                '5a2afbc4564b76b2c27ce5a644cab643c43663835ea0be22433b209d3351f937',
              ],
              pred: 'keys-all',
            },
          },
        },
      },
      nonce: 'kjs:nonce:1698278400000',
      signers: [
        {
          pubKey:
            '5a2afbc4564b76b2c27ce5a644cab643c43663835ea0be22433b209d3351f937',
          scheme: 'ED25519',
        },
      ],
      meta: {
        gasLimit: 70000,
        gasPrice: 1e-8,
        sender:
          'k:5a2afbc4564b76b2c27ce5a644cab643c43663835ea0be22433b209d3351f937',
        ttl: 28800,
        creationTime: 1698278400,
        chainId: '0',
      },
      networkId: 'development',
    });
  });
});
