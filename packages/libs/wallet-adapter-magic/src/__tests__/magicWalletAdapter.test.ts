import type {
  IAccountInfo,
  IJsonRpcSuccess,
  IProvider,
} from '@kadena/wallet-adapter-core';

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MagicAdapter } from '../MagicAdapter';

class MockProvider implements IProvider {
  public request: (args: {
    method: string;
    [key: string]: unknown;
  }) => Promise<unknown> = vi.fn();
  public on: (event: string, listener: (...args: unknown[]) => void) => void =
    vi.fn();
  public off: (event: string, listener: (...args: unknown[]) => void) => void =
    vi.fn();
}

let provider: MockProvider;
let adapter: MagicAdapter;

beforeEach(() => {
  provider = new MockProvider();
  adapter = new MagicAdapter({
    provider,
    networkId: 'testnet04',
    chainId: '0',
    magicApiKey: '123',
    chainwebApiUrl: 'http://example.com',
  });
  vi.clearAllMocks();
});

describe('MagicAdapter', () => {
  describe('kadena_connect', () => {
    it('performs status → connect → status → requestAccount flow on first connect', async () => {
      (provider.request as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        undefined,
      );

      (adapter as any)._magic.kadena.loginWithSpireKey = vi
        .fn()
        .mockResolvedValueOnce({
          accountName: 'alice',
          keyset: {
            keys: ['pk1'],
            pred: 'keys-all',
          },
          chainIds: [],
          networkId: 'testnet04',
        });

      const rpc = (await adapter.request({
        id: 1,
        method: 'kadena_connect',
        params: {},
      })) as IJsonRpcSuccess<IAccountInfo>;

      expect(rpc).toEqual({
        id: 1,
        jsonrpc: '2.0',
        result: {
          accountName: 'alice',
          contract: 'coin',

          existsOnChains: [],
          guard: {
            keys: ['pk1'],
            pred: 'keys-all',
          },
          keyset: {
            keys: ['pk1'],
            pred: 'keys-all',
          },
          networkId: 'testnet04',
        },
      });
    });
  });
});
