import type { ILocalCommandResult } from '@kadena/chainweb-node-client';
import type { IClient, ITransactionDescriptor } from '@kadena/client';
import {
  addSigner,
  composePactCommand,
  execution,
  setMeta,
} from '@kadena/client/fp';
import { crossChainClient } from '../client-helpers';

const calls = (...fns: Array<(...args: any) => any>) => {
  let i = 0;
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
      preflight: vitest.fn(
        calls(
          vitest.fn().mockResolvedValue({
            result: { status: 'success' },
            continuation: {
              pactId: 'test-pact-id',
              step: 0,
              stepCount: 1,
            },
          } as ILocalCommandResult),
        ),
      ),
      submitOne: calls(
        vitest.fn().mockResolvedValue({
          chainId: '1',
          networkId: 'test-network',
          requestKey: 'first-request-key',
        } as ITransactionDescriptor),
        vitest.fn().mockResolvedValue({
          chainId: '2',
          networkId: 'test-network',
          requestKey: 'second-request-key',
        } as ITransactionDescriptor),
      ),
      listen: vitest.fn(
        calls(
          vitest.fn().mockResolvedValue({
            result: { status: 'success' },
            continuation: {
              pactId: 'test-pact-id',
              step: 0,
              stepCount: 1,
            },
          } as ILocalCommandResult),
          vitest.fn().mockResolvedValue({
            result: { status: 'success', data: 'test-data' },
          } as ILocalCommandResult),
        ),
      ),
      pollCreateSpv: vitest.fn().mockResolvedValue('test-spv-proof'),
    } as Partial<IClient> as any;
    const sign = vitest.fn((tx) => ({ ...tx, sigs: [{ sig: 'sig-hash' }] }));
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
          cmd: '{"payload":{"exec":{"code":"(test 1 2 3)","data":{}}},"signers":[{"pubKey":"pk","scheme":"ED25519"}],"meta":{"gasLimit":2500,"gasPrice":1e-8,"sender":"","ttl":28800,"creationTime":1698278400,"chainId":"1"},"nonce":"kjs:nonce:1698278400000","networkId":"test-network"}',
          hash: 'ABVQq4j4C4atHw9SzbY7QuSzhyXIkOGo_MI0m9_wT4s',
          sigs: [
            {
              sig: 'sig-hash',
            },
          ],
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
          cmd: '{"payload":{"cont":{"pactId":"test-pact-id","step":1,"proof":"test-spv-proof","rollback":false,"data":{}}},"meta":{"gasLimit":2500,"gasPrice":1e-8,"sender":"test-gas-station","ttl":28800,"creationTime":1698278400,"chainId":"2"},"nonce":"kjs:nonce:1698278400000","signers":[],"networkId":"test-network"}',
          hash: '02qDfkTYL-MKnoiVKagO0TiWJ_DYok-PSSVNWjtf8qo',
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
      preflight: vitest.fn(
        calls(
          vitest.fn().mockResolvedValue({
            result: { status: 'success' },
            continuation: {
              pactId: 'test-pact-id',
              step: 0,
              stepCount: 1,
            },
          } as ILocalCommandResult),
        ),
      ),
      submitOne: calls(
        vitest.fn().mockResolvedValue({
          chainId: '1',
          networkId: 'test-network',
          requestKey: 'first-request-key',
        } as ITransactionDescriptor),
        vitest.fn().mockResolvedValue({
          chainId: '2',
          networkId: 'test-network',
          requestKey: 'second-request-key',
        } as ITransactionDescriptor),
      ),
      listen: vitest.fn(
        calls(
          vitest.fn().mockResolvedValue({
            result: { status: 'success' },
            continuation: {
              pactId: 'test-pact-id',
              step: 0,
              stepCount: 1,
            },
          } as ILocalCommandResult),
          vitest.fn().mockResolvedValue({
            result: { status: 'success', data: 'test-data' },
          } as ILocalCommandResult),
        ),
      ),
      pollCreateSpv: vitest.fn().mockResolvedValue('test-spv-proof'),
    } as Partial<IClient> as any;
    const sign = vitest.fn(
      calls(
        (tx) => ({ ...tx, sigs: [{ sig: 'sig-hash' }] }),
        (tx) => ({ ...tx, sigs: [{ sig: 'sig-cont-hash' }] }),
      ),
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
          cmd: '{"payload":{"exec":{"code":"(test 1 2 3)","data":{}}},"signers":[{"pubKey":"pk","scheme":"ED25519"}],"meta":{"gasLimit":2500,"gasPrice":1e-8,"sender":"","ttl":28800,"creationTime":1698278400,"chainId":"1"},"nonce":"kjs:nonce:1698278400000","networkId":"test-network"}',
          hash: 'ABVQq4j4C4atHw9SzbY7QuSzhyXIkOGo_MI0m9_wT4s',
          sigs: [
            {
              sig: 'sig-hash',
            },
          ],
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
          cmd: '{"payload":{"cont":{"pactId":"test-pact-id","step":1,"proof":"test-spv-proof","rollback":false,"data":{}}},"meta":{"gasLimit":2500,"gasPrice":1e-8,"sender":"target-chain-gas-payer","ttl":28800,"creationTime":1698278400,"chainId":"2"},"signers":[{"pubKey":"pk-target-chain-gas-payer","scheme":"ED25519","clist":[{"name":"coin.GAS","args":[]}]}],"nonce":"kjs:nonce:1698278400000","networkId":"test-network"}',
          hash: 'HFjmUCt_Ayi7YPKXRk6BZ0myd410LRTebxdrwDZk0Lw',
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
