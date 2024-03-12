import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { ILocalCommandResult } from '@kadena/chainweb-node-client';
import type { IClient, ITransactionDescriptor } from '@kadena/client';
import {
  addSigner,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';
import { submitClient } from '../';

describe('submitClient', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(new Date('2023-10-26'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calls the submit endpoint and returns the result', async () => {
    const client: IClient = {
      preflight: vi.fn().mockResolvedValue({
        result: { status: 'success', data: 'test-data' },
      } as ILocalCommandResult),
      submitOne: vi.fn().mockResolvedValue({
        chainId: '1',
        networkId: 'test-network',
        requestKey: 'test-request-key',
      } as ITransactionDescriptor),
      listen: vi.fn().mockResolvedValue({
        result: { status: 'success', data: 'test-data' },
      } as ILocalCommandResult),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;
    const sign = vi.fn((tx) => ({ ...tx, sigs: [{ sig: 'sig-hash' }] }));
    const submit = submitClient(
      { sign, defaults: { networkId: 'test-network' } },
      client,
    );
    const result = await submit(
      composePactCommand(
        execution('(test 1 2 3)'),
        addSigner('pk'),
        setMeta({ chainId: '1' }),
      ),
    )
      .on('sign', (tx) => {
        expect(tx).toEqual({
          cmd: '{"networkId":"test-network","payload":{"exec":{"code":"(test 1 2 3)","data":{}}},"signers":[{"pubKey":"pk","scheme":"ED25519"}],"meta":{"gasLimit":2500,"gasPrice":1e-8,"sender":"","ttl":28800,"creationTime":1698278400,"chainId":"1"},"nonce":"kjs:nonce:1698278400000"}',
          hash: 'uoS6m3KFHVs-8ByRWfiOweZobK1YzV7WloA1DWM1gd4',
          sigs: [{ sig: 'sig-hash' }],
        });
      })
      .on('preflight', (result) => {
        expect(result).toEqual({
          result: { status: 'success', data: 'test-data' },
        });
      })
      .on('submit', (trDesc) => {
        expect(trDesc).toEqual({
          chainId: '1',
          networkId: 'test-network',
          requestKey: 'test-request-key',
        });
      })
      .on('listen', (result) => {
        expect(result).toEqual({
          result: { status: 'success', data: 'test-data' },
        });
      });

    await expect(result.execute()).resolves.toEqual('test-data');
  });
});
