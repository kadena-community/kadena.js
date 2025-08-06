import type { IProvider } from '@kadena/wallet-adapter-core';
import { describe, expect, it, vi } from 'vitest';
import * as providerModule from '../provider';
import { createSnapAdapter, SnapAdapter } from '../snapAdapterFactory';

describe('snapAdapter factory', () => {
  it('has name "Snap"', () => {
    expect(createSnapAdapter().name).toBe('Snap');
  });

  it('detect() delegates to detectSnapProvider', async () => {
    const fakeProvider: IProvider = {
      request: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
    };
    const detectSpy = vi
      .spyOn(providerModule, 'detectSnapProvider')
      .mockResolvedValueOnce(fakeProvider);
    const factory = createSnapAdapter();
    const detected = await factory.detect();
    expect(detectSpy).toHaveBeenCalledWith({ silent: true });
    expect(detected).toBe(fakeProvider);
    detectSpy.mockRestore();
  });

  it('adapter() returns an SnapAdapter instance', async () => {
    const fakeProvider: IProvider = {
      request: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
    };
    const factory = createSnapAdapter();
    const adapter = await factory.adapter(fakeProvider);
    expect(adapter).toBeInstanceOf(SnapAdapter);
  });
});
