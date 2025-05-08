import type { IProvider } from '@kadena/wallet-adapter-core';
import { describe, expect, it, vi } from 'vitest';
import { eckoAdapter, EckoAdapter } from '../eckoAdapterFactory';
import * as providerModule from '../provider';

describe('eckoAdapter factory', () => {
  it('has name "Ecko"', () => {
    expect(eckoAdapter().name).toBe('Ecko');
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
    const factory = eckoAdapter();
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
    const factory = eckoAdapter();
    const adapter = await factory.adapter(fakeProvider);
    expect(adapter).toBeInstanceOf(EckoAdapter);
  });
});
