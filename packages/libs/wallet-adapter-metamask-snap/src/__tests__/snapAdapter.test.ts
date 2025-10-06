import type {
  IAccountInfo,
  IJsonRpcSuccess,
  INetworkInfo,
  IProvider,
} from '@kadena/wallet-adapter-core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ERRORS } from '../constants';
import { SnapAdapter } from '../SnapAdapter';

let adapter: SnapAdapter;

beforeEach(() => {
  const provider: IProvider = {
    request: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  };
  adapter = new SnapAdapter({ provider, networkId: 'testnet04' });
  vi.clearAllMocks();
});

describe('SnapAdapter', () => {
  describe('kadena_connect', () => {
    it('returns account on successful connect', async () => {
      const account: IAccountInfo = {
        accountName: 'alice',
        networkId: 'testnet04',
        contract: 'coin',
        guard: { keys: ['pk1'], pred: 'keys-all' },
        keyset: { keys: ['pk1'], pred: 'keys-all' },
        existsOnChains: [],
      };
      const connectSpy = vi
        .spyOn(adapter as any, '_connect')
        .mockResolvedValueOnce(account);
      const rpc = (await adapter.request({
        id: 1,
        method: 'kadena_connect',
      })) as IJsonRpcSuccess<IAccountInfo>;
      expect(connectSpy).toHaveBeenCalledWith(false);
      expect(rpc).toEqual({
        id: 1,
        jsonrpc: '2.0',
        result: account,
      });
    });

    it('throws on failed connect', async () => {
      vi.spyOn(adapter as any, '_connect').mockResolvedValueOnce(null);
      await expect(
        adapter.request({ id: 2, method: 'kadena_connect' }),
      ).rejects.toThrow(ERRORS.FAILED_TO_CONNECT);
    });
  });

  describe('disconnect', () => {
    it('does not throw', async () => {
      await expect(adapter.disconnect()).resolves.toBeUndefined();
    });
  });

  describe('kadena_getAccount_v1 & kadena_getAccounts_v2', () => {
    it('returns single account', async () => {
      const accounts: IAccountInfo[] = [
        {
          accountName: 'bob',
          networkId: 'testnet04',
          contract: 'coin',
          guard: { keys: ['pk2'], pred: 'keys-all' },
          keyset: { keys: ['pk2'], pred: 'keys-all' },
          existsOnChains: [],
        },
      ];
      vi.spyOn(adapter as any, '_getAccounts').mockResolvedValueOnce(accounts);
      const rpc = (await adapter.request({
        id: 4,
        method: 'kadena_getAccount_v1',
      })) as IJsonRpcSuccess<IAccountInfo>;
      expect(rpc.result).toEqual(accounts[0]);
    });

    it('returns array of accounts', async () => {
      const accounts: IAccountInfo[] = [
        {
          accountName: 'carol',
          networkId: 'testnet04',
          contract: 'coin',
          guard: { keys: ['pk3'], pred: 'keys-all' },
          keyset: { keys: ['pk3'], pred: 'keys-all' },
          existsOnChains: [],
        },
      ];
      vi.spyOn(adapter as any, '_getAccounts').mockResolvedValueOnce(accounts);
      const rpc = (await adapter.request({
        id: 5,
        method: 'kadena_getAccounts_v2',
      })) as IJsonRpcSuccess<IAccountInfo[]>;
      expect(rpc.result).toEqual(accounts);
    });
  });

  describe('kadena_getNetwork_v1 & kadena_getNetworks_v1', () => {
    it('returns single network', async () => {
      const network: INetworkInfo = {
        networkName: 'mainnet',
        networkId: 'mainnet01',
        url: ['https://api.chainweb.com'],
      };
      vi.spyOn(adapter as any, '_getActiveNetwork').mockResolvedValueOnce(
        network,
      );
      const rpc = (await adapter.request({
        id: 6,
        method: 'kadena_getNetwork_v1',
      })) as IJsonRpcSuccess<INetworkInfo>;
      expect(rpc.result).toEqual(network);
    });

    it('returns array of networks', async () => {
      const networks: INetworkInfo[] = [
        {
          networkName: 'testnet',
          networkId: 'testnet04',
          url: ['https://api.testnet.chainweb.com'],
        },
      ];
      vi.spyOn(adapter as any, '_getNetworks').mockResolvedValueOnce(networks);
      const rpc = (await adapter.request({
        id: 7,
        method: 'kadena_getNetworks_v1',
      })) as IJsonRpcSuccess<INetworkInfo[]>;
      expect(rpc.result).toEqual(networks);
    });
  });

  // describe('kadena_sign_v1', () => {
  //   it('returns JSON-RPC success for signed command', async () => {
  //     const response = {
  //       outcome: { result: 'success', hash: 'h' },
  //       commandSigData: {
  //         cmd: JSON.stringify({ meta: { chainId: '1' } }),
  //         sigs: [],
  //       },
  //     };
  //     vi.spyOn(adapter as any, '_invokeSnap').mockImplementation(async () =>
  //       JSON.stringify(response),
  //     );
  //     const rpc = (await adapter.request({
  //       id: 8,
  //       method: 'kadena_sign_v1',
  //       params: { code: '', data: {}, caps: [] },
  //     })) as IJsonRpcSuccess<{ body: ICommand; chainId: string }>;
  //     expect(rpc.result.body).toEqual({
  //       cmd: response.commandSigData.cmd,
  //       hash: 'h',
  //       sigs: [],
  //     });
  //     expect(rpc.result.chainId).toBe('1');
  //   });

  //   it('throws on status fail', async () => {
  //     const response = {
  //       outcome: { result: 'fail', hash: 'h' },
  //       commandSigData: { cmd: '', sigs: [] },
  //     };
  //     vi.spyOn(adapter as any, '_invokeSnap').mockImplementation(async () =>
  //       JSON.stringify(response),
  //     );
  //     await expect(
  //       adapter.request({
  //         id: 9,
  //         method: 'kadena_sign_v1',
  //         params: { code: '', data: {}, caps: [] },
  //       }),
  //     ).rejects.toThrow(response.outcome.result);
  //   });
  // });

  // describe('kadena_quicksign_v1', () => {
  //   it('returns JSON-RPC success for quicksign', async () => {
  //     const quicksignResp: IQuicksignResponseOutcomes = {
  //       responses: [
  //         {
  //           commandSigData: { cmd: '', sigs: [] },
  //           outcome: { result: 'success', hash: 'h' },
  //         },
  //       ],
  //     };
  //     vi.spyOn(adapter as any, '_signTransaction').mockResolvedValueOnce(
  //       JSON.stringify(quicksignResp),
  //     );
  //     const rpc = (await adapter.request({
  //       id: 10,
  //       method: 'kadena_quicksign_v1',
  //       params: { commandSigDatas: [{ cmd: '', sigs: [] }] },
  //     })) as IJsonRpcSuccess<IQuicksignResponseOutcomes>;
  //     expect(rpc.result).toEqual(quicksignResp);
  //   });

  //   it('throws on status fail', async () => {
  //     const quicksignResp: IQuicksignResponseOutcomes = {
  //       responses: [
  //         {
  //           commandSigData: { cmd: '', sigs: [] },
  //           outcome: { result: 'failure', msg: 'nope' },
  //         },
  //       ],
  //     };
  //     vi.spyOn(adapter as any, '_signTransaction').mockResolvedValueOnce(
  //       JSON.stringify(quicksignResp),
  //     );
  //     const rpc = (await adapter.request({
  //       id: 11,
  //       method: 'kadena_quicksign_v1',
  //       params: { commandSigDatas: [{ cmd: '', sigs: [] }] },
  //     })) as IJsonRpcSuccess<IQuicksignResponseOutcomes>;
  //     expect(rpc.result.responses[0].outcome).toEqual({
  //       result: 'failure',
  //       msg: 'nope',
  //     });
  //   });
  // });
});
