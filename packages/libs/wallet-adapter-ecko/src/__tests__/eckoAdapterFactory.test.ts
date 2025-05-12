import type { IProvider } from '@kadena/wallet-adapter-core';
import { describe, expect, it, vi } from 'vitest';
import { createEckoAdapter, EckoAdapter } from '../eckoAdapterFactory';
import * as providerModule from '../provider';

describe('eckoAdapter factory', () => {
  it('has name "Ecko"', () => {
    expect(createEckoAdapter().name).toBe('Ecko');
  });

  it('detect() delegates to detectEckoProvider', async () => {
    const fakeProvider: IProvider = {
      request: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
    };
    const detectSpy = vi
      .spyOn(providerModule, 'detectEckoProvider')
      .mockResolvedValueOnce(fakeProvider);
    const factory = createEckoAdapter();
    const detected = await factory.detect();
    expect(detectSpy).toHaveBeenCalledWith({ silent: true });
    expect(detected).toBe(fakeProvider);
    detectSpy.mockRestore();
  });

  it('adapter() returns an EckoAdapter instance', async () => {
    const fakeProvider: IProvider = {
      request: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
    };
    const factory = createEckoAdapter();
    const adapter = await factory.adapter(fakeProvider);
    expect(adapter).toBeInstanceOf(EckoAdapter);
  });
});
