import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BaseWalletAdapter } from '../BaseWalletAdapter';
import type {
  IKdaMethodMap,
  ISigningRequestPartial,
  IUnsignedCommand,
} from '../types';

declare module '../types' {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface IKdaMethodMap {
    test: {
      params: {};
      response: { id: number; jsonrpc: '2.0'; result: unknown };
    };
  }
}

vi.mock('../utils/sign', () => ({
  prepareQuickSignCmd: vi.fn(async (cmd: unknown) => ({
    commandSigDatas: [{ cmd: 'cmd-data', sigs: [] }],
    transactionHashes: ['txhash'],
    transactions: [cmd],
    isList: Array.isArray(cmd),
  })),
  finalizeQuickSignTransaction: vi.fn((result: unknown) => ({
    finalized: true,
    result,
  })),
  prepareSignCmd: vi.fn((cmd: unknown) => ({
    caps: [],
    code: 'code',
    ...(cmd as object),
  })),
}));

const mockProvider = {
  request: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
};

class MockAdapter extends BaseWalletAdapter {
  public name: string = 'MockAdapter';
}

let adapter: MockAdapter;

beforeEach(() => {
  vi.clearAllMocks();
  adapter = new MockAdapter({ provider: mockProvider, networkId: 'testnet04' });
});

describe('BaseWalletAdapter', () => {
  it('Request calls provider request method correctly', async () => {
    mockProvider.request.mockResolvedValueOnce({
      id: 1,
      jsonrpc: '2.0',
      result: { foo: 'bar' },
    });
    const response = await adapter.request({
      method: 'test',
      params: {},
    });
    expect(mockProvider.request).toHaveBeenCalledWith({
      method: 'test',
      params: {},
    });
    expect(response).toEqual({
      id: 1,
      jsonrpc: '2.0',
      result: { foo: 'bar' },
    });
  });

  it('forwards requests to the provider and returns the RPC response', async () => {
    const rpc = {
      id: 1,
      jsonrpc: '2.0',
      result: { foo: 'bar' },
    } as IKdaMethodMap['test']['response'];
    mockProvider.request.mockResolvedValueOnce(rpc);

    const response = await adapter.request({ method: 'test', params: {} });

    expect(mockProvider.request).toHaveBeenCalledWith({
      method: 'test',
      params: {},
    });

    expect(response).toEqual(rpc);
  });

  it('throws if provider returns a non–JSON‑RPC shape', async () => {
    // provider returns something completely bogus
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockProvider.request.mockResolvedValueOnce({ foo: 123 } as any);

    await expect(
      adapter.request({ method: 'test', params: {} }),
    ).rejects.toThrow('Provider response is not a valid JSON-RPC 2.0 response');
  });

  it('connect returns null when JSON‑RPC connect call errors', async () => {
    const errResp: IKdaMethodMap['kadena_connect']['response'] = {
      id: 3,
      jsonrpc: '2.0',
      error: { code: -32002, message: 'denied', data: {} },
    };
    mockProvider.request.mockResolvedValueOnce(errResp);

    const account = await adapter.connect({});
    expect(account).toBeNull();
  });

  it('connect calls kadena_connect and returns the account on success', async () => {
    const success = {
      id: 2,
      jsonrpc: '2.0',
      result: { accountName: 'alice' },
    } as IKdaMethodMap['kadena_connect']['response'];
    mockProvider.request.mockResolvedValueOnce(success);

    const account = await adapter.connect({});

    expect(mockProvider.request).toHaveBeenCalledWith({
      method: 'kadena_connect',
      params: { networkId: 'testnet04' },
    });
    expect(account).toEqual({ accountName: 'alice' });
  });

  it('disconnect calls kadena_disconnect with the current networkId', async () => {
    const resp = {
      id: 3,
      jsonrpc: '2.0',
      result: undefined,
    } as IKdaMethodMap['kadena_disconnect']['response'];
    mockProvider.request.mockResolvedValueOnce(resp);

    await adapter.disconnect();

    expect(mockProvider.request).toHaveBeenCalledWith({
      method: 'kadena_disconnect',
      params: { networkId: 'testnet04' },
    });
  });

  it('getActiveAccount returns the account result on JSON-RPC success', async () => {
    const resp = {
      id: 4,
      jsonrpc: '2.0',
      result: { accountName: 'bob' },
    } as IKdaMethodMap['kadena_getAccount_v1']['response'];
    mockProvider.request.mockResolvedValueOnce(resp);

    const account = await adapter.getActiveAccount();
    expect(account.accountName).toBe('bob');
  });

  it('getAccounts returns an array of accounts', async () => {
    const resp = {
      id: 5,
      jsonrpc: '2.0',
      result: [{ accountName: 'c1' }],
    } as IKdaMethodMap['kadena_getAccounts_v2']['response'];
    mockProvider.request.mockResolvedValueOnce(resp);

    const accounts = await adapter.getAccounts();
    expect(accounts).toEqual([{ accountName: 'c1' }]);
  });

  it('getActiveNetwork returns the network info on JSON-RPC success', async () => {
    const resp = {
      id: 6,
      jsonrpc: '2.0',
      result: { networkName: 'n', networkId: 'testnet04' },
    } as IKdaMethodMap['kadena_getNetwork_v1']['response'];
    mockProvider.request.mockResolvedValueOnce(resp);

    const net = await adapter.getActiveNetwork();
    expect(net.networkId).toBe('testnet04');
  });

  it('getNetworks returns a list of network info', async () => {
    const resp = {
      id: 7,
      jsonrpc: '2.0',
      result: [{ networkName: 'x', networkId: 'x1' }],
    } as IKdaMethodMap['kadena_getNetworks_v1']['response'];
    mockProvider.request.mockResolvedValueOnce(resp);

    const nets = await adapter.getNetworks();
    expect(nets).toEqual([{ networkName: 'x', networkId: 'x1' }]);
  });

  it('throws if quicksign RPC returns a JSON‑RPC error', async () => {
    const rpcError: IKdaMethodMap['kadena_quicksign_v1']['response'] = {
      id: 8,
      jsonrpc: '2.0',
      error: { code: -32000, message: 'fail', data: {} },
    };
    mockProvider.request.mockResolvedValueOnce(rpcError);

    await expect(
      adapter.signTransaction({
        cmd: 'c',
        hash: 'h',
        sigs: [],
      } as IUnsignedCommand),
    ).rejects.toThrow('Error signing transaction');
  });

  it('throws if quicksign RPC returns a non‑JSON‑RPC shape', async () => {
    // A totally invalid shape
    mockProvider.request.mockResolvedValueOnce({ foo: 123 });

    await expect(
      adapter.signTransaction({
        cmd: 'c',
        hash: 'h',
        sigs: [],
      } as IUnsignedCommand),
    ).rejects.toThrow('Provider response is not a valid JSON-RPC 2.0 response');
  });

  it('signCommand calls sign RPC and returns the signed command body', async () => {
    const body = { cmd: 'c', hash: 'h', sigs: [] };
    const rpc = {
      id: 9,
      jsonrpc: '2.0',
      result: { body, chainId: '1' },
    } as IKdaMethodMap['kadena_sign_v1']['response'];
    mockProvider.request.mockResolvedValueOnce(rpc);

    const req: ISigningRequestPartial = { caps: [], code: '' };
    const signed = await adapter.signCommand(req);

    expect(mockProvider.request).toHaveBeenCalledWith({
      method: 'kadena_sign_v1',
      params: expect.objectContaining({ code: '' }),
    });
    expect(signed).toEqual(body);
  });
});
