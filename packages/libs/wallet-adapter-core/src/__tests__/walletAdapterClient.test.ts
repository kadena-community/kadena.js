import { beforeEach, describe, expect, it, vi } from 'vitest';
import { WalletAdapterClient } from '../WalletAdapterClient';
import type { IAdapter } from '../types';

describe('WalletAdapterClient', () => {
  let mockAdapter: IAdapter;
  let client: WalletAdapterClient;

  beforeEach(() => {
    mockAdapter = {
      name: 'Mock',
      request: vi.fn().mockResolvedValue('resp'),
      on: vi.fn().mockReturnThis(),
      off: vi.fn().mockReturnThis(),
      connect: vi.fn().mockResolvedValue('account'),
      disconnect: vi.fn().mockResolvedValue(undefined),
      getActiveAccount: vi.fn().mockResolvedValue('activeAccount'),
      getAccounts: vi.fn().mockResolvedValue(['acc1', 'acc2']),
      getActiveNetwork: vi.fn().mockResolvedValue('network'),
      getNetworks: vi.fn().mockResolvedValue(['net1', 'net2']),
      signTransaction: vi.fn().mockResolvedValue('signedTx'),
      signCommand: vi.fn().mockResolvedValue('signedCmd'),
      onAccountChange: vi.fn(),
      onNetworkChange: vi.fn(),
      changeNetwork: vi.fn().mockResolvedValue({ success: true }),
    } as unknown as IAdapter;

    client = new WalletAdapterClient([mockAdapter]);
  });

  it('reports detected adapters correctly', () => {
    const providers = client.getProviders();
    expect(providers).toContainEqual({ name: 'Mock', detected: true });
    expect(client.getDetectedAdapters()).toEqual([mockAdapter]);
    expect(client.isDetected('Mock')).toBe(true);
    expect(client.isDetected('Nonexistent')).toBe(false);
  });

  it('forwards request to the correct adapter', async () => {
    const result = await client.request('Mock', { method: 'foo', bar: 123 });
    expect(mockAdapter.request).toHaveBeenCalledWith({
      method: 'foo',
      bar: 123,
    });
    expect(result).toBe('resp');
  });

  it('connect calls adapter.connect', async () => {
    const res = await client.connect('Mock', { param: 'value' });
    expect(mockAdapter.connect).toHaveBeenCalledWith({ param: 'value' });
    expect(res).toBe('account');
  });

  it('disconnect calls adapter.disconnect', async () => {
    await client.disconnect('Mock');
    expect(mockAdapter.disconnect).toHaveBeenCalled();
  });

  it('getActiveAccount calls adapter.getActiveAccount', async () => {
    const res = await client.getActiveAccount('Mock');
    expect(mockAdapter.getActiveAccount).toHaveBeenCalled();
    expect(res).toBe('activeAccount');
  });

  it('getAccounts calls adapter.getAccounts', async () => {
    const res = await client.getAccounts('Mock');
    expect(mockAdapter.getAccounts).toHaveBeenCalled();
    expect(res).toEqual(['acc1', 'acc2']);
  });

  it('getActiveNetwork calls adapter.getActiveNetwork', async () => {
    const res = await client.getActiveNetwork('Mock');
    expect(mockAdapter.getActiveNetwork).toHaveBeenCalled();
    expect(res).toBe('network');
  });

  it('getNetworks calls adapter.getNetworks', async () => {
    const res = await client.getNetworks('Mock');
    expect(mockAdapter.getNetworks).toHaveBeenCalled();
    expect(res).toEqual(['net1', 'net2']);
  });

  it('signTransaction calls adapter.signTransaction', async () => {
    const unsignedTx = { cmd: '', hash: '', sigs: [] };
    const res = await client.signTransaction('Mock', [unsignedTx]);
    expect(mockAdapter.signTransaction).toHaveBeenCalledWith([unsignedTx]);
    expect(res).toBe('signedTx');
  });

  it('signCommand calls adapter.signCommand', async () => {
    const req = { caps: [], code: '' };
    const res = await client.signCommand('Mock', req);
    expect(mockAdapter.signCommand).toHaveBeenCalledWith(req);
    expect(res).toBe('signedCmd');
  });

  it('onAccountChange delegates correctly', () => {
    const cb = vi.fn();
    client.onAccountChange('Mock', cb);
    expect(mockAdapter.onAccountChange).toHaveBeenCalledWith(cb);
  });

  it('onNetworkChange delegates correctly', () => {
    const cb = vi.fn();
    client.onNetworkChange('Mock', cb);
    expect(mockAdapter.onNetworkChange).toHaveBeenCalledWith(cb);
  });

  it('throws when adapter is not found', async () => {
    await expect(
      client.request('Unknown', { method: 'ping' }),
    ).rejects.toThrow();
  });
});
