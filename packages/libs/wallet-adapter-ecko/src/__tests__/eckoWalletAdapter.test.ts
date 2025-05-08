import type {
  IAccountInfo,
  ICommand,
  IJsonRpcSuccess,
  INetworkInfo,
  IProvider,
} from '@kadena/wallet-adapter-core';

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EckoAdapter } from '../EckoAdapter';
import type {
  IEckoQuicksignResponse,
  IQuicksignResponseOutcomes,
  IRawAccountResponse,
  IRawNetworkResponse,
  IRawRequestResponse,
} from '../types';

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
let adapter: EckoAdapter;

beforeEach(() => {
  provider = new MockProvider();
  adapter = new EckoAdapter({ provider, networkId: 'testnet04' });
  vi.clearAllMocks();
});

describe('EckoAdapter', () => {
  describe('kadena_connect', () => {
    it('performs status → connect → status → requestAccount flow on first connect', async () => {
      const statusFail: IRawRequestResponse = {
        status: 'fail',
        message: 'nope',
      };
      const statusOK: IRawRequestResponse = { status: 'success' };
      const acctResp: IRawAccountResponse = {
        status: 'success',
        wallet: { account: 'alice', publicKey: 'pk1' },
      };

      (provider.request as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce(statusFail) // kda_checkStatus #1
        .mockResolvedValueOnce(undefined) // kda_connect
        .mockResolvedValueOnce(statusOK) // kda_checkStatus #2
        .mockResolvedValueOnce(acctResp); // kda_requestAccount

      const rpc = (await adapter.request({
        id: 1,
        method: 'kadena_connect',
        params: {},
      })) as IJsonRpcSuccess<IAccountInfo>;

      expect(provider.request).toHaveBeenNthCalledWith(1, {
        method: 'kda_checkStatus',
        networkId: 'testnet04',
      });
      expect(provider.request).toHaveBeenNthCalledWith(2, {
        method: 'kda_connect',
        networkId: 'testnet04',
      });
      expect(provider.request).toHaveBeenNthCalledWith(3, {
        method: 'kda_checkStatus',
        networkId: 'testnet04',
      });
      expect(provider.request).toHaveBeenNthCalledWith(4, {
        method: 'kda_requestAccount',
        networkId: 'testnet04',
      });

      expect(rpc).toEqual({
        id: 1,
        jsonrpc: '2.0',
        result: {
          accountName: 'alice',
          networkId: 'testnet04',
          contract: 'coin',
          guard: { keys: ['pk1'], pred: 'keys-all' },
          chainAccounts: [],
        },
      });
    });

    it('throws if status stays fail', async () => {
      const statusFail: IRawRequestResponse = {
        status: 'fail',
        message: 'nope',
      };
      (provider.request as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce(statusFail)
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(statusFail);

      await expect(
        adapter.request({ id: 2, method: 'kadena_connect', params: {} }),
      ).rejects.toThrow('nope');
    });
  });

  describe('kadena_disconnect', () => {
    it('calls kda_disconnect and returns JSON‑RPC success', async () => {
      (provider.request as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        undefined,
      );

      const rpc = (await adapter.request({
        id: 3,
        method: 'kadena_disconnect',
        params: {},
      })) as IJsonRpcSuccess<void>;

      expect(provider.request).toHaveBeenCalledWith({
        method: 'kda_disconnect',
        networkId: 'testnet04',
      });
      expect(rpc).toEqual({ id: 3, jsonrpc: '2.0', result: undefined });
    });
  });

  describe('kadena_getAccount_v1 & kadena_getAccounts_v2', () => {
    it('maps kda_requestAccount → single account', async () => {
      const acct: IRawAccountResponse = {
        status: 'success',
        wallet: { account: 'bob', publicKey: 'pk2' },
      };
      (provider.request as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        acct,
      );

      const rpc = (await adapter.request({
        id: 4,
        method: 'kadena_getAccount_v1',
        params: {},
      })) as IJsonRpcSuccess<IAccountInfo>;

      expect(rpc.result.accountName).toBe('bob');
    });

    it('maps kda_requestAccount → array of accounts', async () => {
      const acct: IRawAccountResponse = {
        status: 'success',
        wallet: { account: 'carol', publicKey: 'pk3' },
      };
      (provider.request as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        acct,
      );

      const rpc = (await adapter.request({
        id: 5,
        method: 'kadena_getAccounts_v2',
        params: {},
      })) as IJsonRpcSuccess<IAccountInfo[]>;

      expect(rpc.result).toEqual([
        {
          accountName: 'carol',
          networkId: 'testnet04',
          contract: 'coin',
          guard: { keys: ['pk3'], pred: 'keys-all' },
          chainAccounts: [],
        },
      ]);
    });
  });

  describe('kadena_getNetwork_v1 & kadena_getNetworks_v1', () => {
    it('maps kda_getNetwork → single network', async () => {
      const net: IRawNetworkResponse = {
        name: 'mainnet',
        networkId: 'mainnet01',
        url: 'https://api.kadena.io',
      };
      (provider.request as ReturnType<typeof vi.fn>).mockResolvedValueOnce(net);

      const rpc = (await adapter.request({
        id: 6,
        method: 'kadena_getNetwork_v1',
        params: {},
      })) as IJsonRpcSuccess<INetworkInfo>;

      expect(rpc.result).toEqual({
        networkName: 'mainnet',
        networkId: 'mainnet01',
        url: ['https://api.kadena.io'],
      });
    });

    it('maps kda_getNetwork → array of networks', async () => {
      const net: IRawNetworkResponse = {
        name: 'testnet',
        networkId: 'testnet04',
        url: 'https://testnet.chainweb.com',
      };
      (provider.request as ReturnType<typeof vi.fn>).mockResolvedValueOnce(net);

      const rpc = (await adapter.request({
        id: 7,
        method: 'kadena_getNetworks_v1',
        params: {},
      })) as IJsonRpcSuccess<INetworkInfo[]>;

      expect(rpc.result).toEqual([
        {
          networkName: 'testnet',
          networkId: 'testnet04',
          url: ['https://testnet.chainweb.com'],
        },
      ]);
    });
  });

  describe('kadena_sign_v1', () => {
    it('returns JSON‑RPC success for signed command', async () => {
      const signedCmd = { cmd: '{"meta":{}}', hash: 'h', sigs: [] } as ICommand;
      (provider.request as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        status: 'success',
        message: '',
        signedCmd,
      });

      const rpc = (await adapter.request({
        id: 8,
        method: 'kadena_sign_v1',
        params: { caps: [], code: '' },
      })) as IJsonRpcSuccess<{ body: ICommand; chainId: string }>;

      expect(rpc.result.body).toEqual(signedCmd);
    });

    it('throws on status fail', async () => {
      (provider.request as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        status: 'fail',
        message: 'bad',
      });

      await expect(
        adapter.request({
          id: 9,
          method: 'kadena_sign_v1',
          params: { caps: [], code: '' },
        }),
      ).rejects.toThrow('bad');
    });
  });

  describe('kadena_quicksign_v1', () => {
    it('returns JSON‑RPC success for quicksign', async () => {
      // explicitly type as the literal-success variant
      const responses: IQuicksignResponseOutcomes['responses'] = [
        {
          commandSigData: { cmd: '', sigs: [] },
          outcome: { hash: 'h', result: 'success' },
        },
      ];
      const eckoResp: IEckoQuicksignResponse = { status: 'success', responses };
      (provider.request as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        eckoResp,
      );

      const rpc = (await adapter.request({
        id: 10,
        method: 'kadena_quicksign_v1',
        params: { commandSigDatas: [] },
      })) as IJsonRpcSuccess<IQuicksignResponseOutcomes>;

      expect(rpc.result.responses).toBe(responses);
    });

    it('throws on status fail', async () => {
      const eckoFail = { status: 'fail', error: 'nope' };
      (provider.request as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        eckoFail,
      );

      await expect(
        adapter.request({
          id: 11,
          method: 'kadena_quicksign_v1',
          params: { commandSigDatas: [] },
        }),
      ).rejects.toThrow('nope');
    });
  });
});
