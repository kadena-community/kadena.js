import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { ILocalCommandResult } from '@kadena/chainweb-node-client';
import type { IClient, ITransactionDescriptor } from '@kadena/client';
import {
  addSigner,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';
import { crossChainClient } from '../';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const calls = (...fns: Array<(...args: any) => any>) => {
  let i = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any[]) => fns[i++](...args);
};

describe('crossChainClient', () => {
  beforeEach(() => {
    vi.useFakeTimers().setSystemTime(new Date('2023-10-26'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('runs a cross chain flow including exec and cont', async () => {
    const client: IClient = {
      preflight: vi.fn().mockResolvedValue({
        result: { status: 'success' },
        continuation: {
          pactId: 'test-pact-id',
          step: 0,
          stepCount: 1,
        },
      } as ILocalCommandResult),

      submitOne: calls(
        vi.fn().mockResolvedValue({
          chainId: '1',
          networkId: 'test-network',
          requestKey: 'first-request-key',
        } as ITransactionDescriptor),
        vi.fn().mockResolvedValue({
          chainId: '2',
          networkId: 'test-network',
          requestKey: 'second-request-key',
        } as ITransactionDescriptor),
      ),
      listen: calls(
        vi.fn().mockResolvedValue({
          result: { status: 'success' },
          continuation: {
            pactId: 'test-pact-id',
            step: 0,
            stepCount: 1,
          },
        } as ILocalCommandResult),
        vi.fn().mockResolvedValue({
          result: { status: 'success', data: 'test-data' },
        } as ILocalCommandResult),
      ),

      pollCreateSpv: vi.fn().mockResolvedValue('test-spv-proof'),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as Partial<IClient> as any;
    const sign = vi.fn((tx) => ({ ...tx, sigs: [{ sig: 'sig-hash' }] }));
    const crossChain = crossChainClient(
      { sign, defaults: { networkId: 'test-network' } },
      client,
    )('2', { account: 'test-gas-station' });

    const result = await crossChain(
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
          result: { status: 'success' },
          continuation: {
            pactId: 'test-pact-id',
            step: 0,
            stepCount: 1,
          },
        });
      })
      .on('submit', (trDesc) => {
        expect(trDesc).toEqual({
          chainId: '1',
          networkId: 'test-network',
          requestKey: 'first-request-key',
        });
      })
      .on('listen', (result) => {
        expect(result).toEqual({
          result: { status: 'success' },
          continuation: {
            pactId: 'test-pact-id',
            step: 0,
            stepCount: 1,
          },
        });
      })
      .on('poll-spv', (reqKey) => {
        expect(reqKey).toEqual('first-request-key');
      })
      .on('spv-proof', (data) => {
        expect(data).toEqual({
          pactId: 'test-pact-id',
          step: 1,
          proof: 'test-spv-proof',
          rollback: false,
          data: {},
        });
      })
      .on('sign-continuation', () => {
        // since we pass gas station this should not be called
        expect("shouldn't be called").toBe(true);
      })
      .on('gas-station', (data) => {
        expect(data).toEqual({
          cmd: '{"networkId":"test-network","payload":{"cont":{"data":{},"pactId":"test-pact-id","step":1,"proof":"test-spv-proof","rollback":false}},"meta":{"gasLimit":2500,"gasPrice":1e-8,"sender":"test-gas-station","ttl":28800,"creationTime":1698278400,"chainId":"2"},"nonce":"kjs:nonce:1698278400000","signers":[]}',
          hash: '5Wz0TmL_2kKEKpB2BiKwmOlesITo-I19nxrGFtN6mXw',
          sigs: [],
        });
      })
      .on('submit-continuation', (data) => {
        expect(data).toEqual({
          chainId: '2',
          networkId: 'test-network',
          requestKey: 'second-request-key',
        });
      })
      .on('listen-continuation', (data) => {
        expect(data).toEqual({
          result: { status: 'success', data: 'test-data' },
        });
      });

    await expect(result.execute()).resolves.toEqual('test-data');
  });

  it('runs a cross chain flow including exec and cont and call the sign if gas payer is not a gas station ', async () => {
    const client: IClient = {
      preflight: vi.fn().mockResolvedValue({
        result: { status: 'success' },
        continuation: {
          pactId: 'test-pact-id',
          step: 0,
          stepCount: 1,
        },
      } as ILocalCommandResult),

      submitOne: calls(
        vi.fn().mockResolvedValue({
          chainId: '1',
          networkId: 'test-network',
          requestKey: 'first-request-key',
        } as ITransactionDescriptor),
        vi.fn().mockResolvedValue({
          chainId: '2',
          networkId: 'test-network',
          requestKey: 'second-request-key',
        } as ITransactionDescriptor),
      ),
      listen: calls(
        vi.fn().mockResolvedValue({
          result: { status: 'success' },
          continuation: {
            pactId: 'test-pact-id',
            step: 0,
            stepCount: 1,
          },
        } as ILocalCommandResult),
        vi.fn().mockResolvedValue({
          result: { status: 'success', data: 'test-data' },
        } as ILocalCommandResult),
      ),

      pollCreateSpv: vi.fn().mockResolvedValue('test-spv-proof'),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as Partial<IClient> as any;
    const sign = calls(
      vi.fn((tx) => ({ ...tx, sigs: [{ sig: 'sig-hash' }] })),
      vi.fn((tx) => ({ ...tx, sigs: [{ sig: 'sig-cont-hash' }] })),
    );

    const crossChain = crossChainClient(
      { sign, defaults: { networkId: 'test-network' } },
      client,
    )('2', {
      account: 'target-chain-gas-payer',
      publicKeys: ['pk-target-chain-gas-payer'],
    });

    const result = await crossChain(
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
          result: { status: 'success' },
          continuation: {
            pactId: 'test-pact-id',
            step: 0,
            stepCount: 1,
          },
        });
      })
      .on('submit', (trDesc) => {
        expect(trDesc).toEqual({
          chainId: '1',
          networkId: 'test-network',
          requestKey: 'first-request-key',
        });
      })
      .on('listen', (result) => {
        expect(result).toEqual({
          result: { status: 'success' },
          continuation: {
            pactId: 'test-pact-id',
            step: 0,
            stepCount: 1,
          },
        });
      })
      .on('poll-spv', (reqKey) => {
        expect(reqKey).toEqual('first-request-key');
      })
      .on('spv-proof', (data) => {
        expect(data).toEqual({
          pactId: 'test-pact-id',
          step: 1,
          proof: 'test-spv-proof',
          rollback: false,
          data: {},
        });
      })
      .on('sign-continuation', (tx) => {
        expect(tx).toEqual({
          cmd: '{"networkId":"test-network","payload":{"cont":{"data":{},"pactId":"test-pact-id","step":1,"proof":"test-spv-proof","rollback":false}},"meta":{"gasLimit":2500,"gasPrice":1e-8,"sender":"target-chain-gas-payer","ttl":28800,"creationTime":1698278400,"chainId":"2"},"nonce":"kjs:nonce:1698278400000","signers":[{"pubKey":"pk-target-chain-gas-payer","scheme":"ED25519","clist":[{"name":"coin.GAS","args":[]}]}]}',
          hash: '98unmynMm1cd0PSZtIKTSrGrb4pXckPfFo2huVELHiI',
          sigs: [{ sig: 'sig-cont-hash' }],
        });
      })
      .on('gas-station', () => {
        // since we pass an account as gas-payer  this should not be called
        expect("shouldn't be called").toBe(true);
      })
      .on('submit-continuation', (data) => {
        expect(data).toEqual({
          chainId: '2',
          networkId: 'test-network',
          requestKey: 'second-request-key',
        });
      })
      .on('listen-continuation', (data) => {
        expect(data).toEqual({
          result: { status: 'success', data: 'test-data' },
        });
      });

    await expect(result.execute()).resolves.toEqual('test-data');
  });
});
