declare module '../types' {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface KdaMethodMap {
    test: {
      params: {};
    };
  }
}

import { describe, expect, it, vi } from 'vitest';
import { BaseWalletAdapter } from '../BaseWalletAdapter';

const mockProvider = {
  request: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
};

class MockAdapter extends BaseWalletAdapter {
  public name: string = 'MockAdapter';
  public constructor() {
    super({ provider: mockProvider });
  }
}

const adapter = new MockAdapter();

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
});
