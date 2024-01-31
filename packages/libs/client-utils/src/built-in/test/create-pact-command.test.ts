import { createSignWithKeypair } from '@kadena/client';
import { ChainId } from '@kadena/types';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { IClientConfig } from '../../core/utils/helpers';
import {
  ITransactionBodyInput,
  createPactCommand,
  deployContract,
} from '../deploy-contract';
import { contractCode, input, sourceAccount } from './test-data';

const defaultChainId: ChainId = '0';

describe('createPactCommand', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(new Date('2023-10-26'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return a pact command with the correct structure', async () => {
    const command = createPactCommand({ contractCode, transactionBody: input });

    expect(command).toEqual({
      payload: { exec: { code: '(+ 1 1)', data: {} } },
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
      networkId: 'fast-development',
    });
  });
});
