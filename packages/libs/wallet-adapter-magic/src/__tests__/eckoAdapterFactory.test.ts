import type { IProvider } from '@kadena/wallet-adapter-core';
import { describe, expect, it, vi } from 'vitest';
import { createMagicAdapter, MagicAdapter } from '../magicAdapterFactory';
import * as providerModule from '../provider';

describe('magicAdapter factory', () => {
  it('has name "Magic"', () => {
    expect(createMagicAdapter({}).name).toBe('Magic');
  });

  it('detect() delegates to detectMagicProvider', async () => {
    const fakeProvider: IProvider = {
      request: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
    };
    const detectSpy = vi
      .spyOn(providerModule, 'detectMagicProvider')
      .mockResolvedValueOnce(fakeProvider);
    const factory = createMagicAdapter({});
    const detected = await factory.detect();
    expect(detectSpy).toHaveBeenCalledWith({ silent: true });
    expect(detected).toBe(fakeProvider);
    detectSpy.mockRestore();
  });

  it('adapter() returns an MagicAdapter instance', async () => {
    const fakeProvider: IProvider = {
      request: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
    };
    const factory = createMagicAdapter({});
    const adapter = await factory.adapter(fakeProvider);
    expect(adapter).toBeInstanceOf(MagicAdapter);
  });
});
