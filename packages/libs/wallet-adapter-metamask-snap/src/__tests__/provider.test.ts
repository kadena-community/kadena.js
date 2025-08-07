import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ISnapProvider } from '../provider';
import { defaultSnapOrigin, detectSnapProvider } from '../provider';

describe('detectSnapProvider', () => {
  beforeEach(() => {
    const win = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).window = win;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (globalThis as any).window.kadena;
    vi.useRealTimers();
  });

  it('resolves to provider when window.ethereum exists, isMetaMask true, and snap installed', async () => {
    const snaps = {
      [defaultSnapOrigin]: {
        id: defaultSnapOrigin,
        version: '0.0.0',
        enabled: true,
        blocked: false,
      },
    };
    const fakeProvider: ISnapProvider = {
      isMetaMask: true,
      request: vi.fn().mockResolvedValue(snaps),
      on: () => {},
      off: () => {},
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).window.ethereum = fakeProvider;

    const result = await detectSnapProvider();
    expect(result).toBe(fakeProvider);
    expect(fakeProvider.request).toHaveBeenCalledWith({
      method: 'wallet_getSnaps',
    });
  });

  it('resolves to undefined when window.ethereum exists but isMetaMask false', async () => {
    const fakeProvider: ISnapProvider = {
      isMetaMask: false,
      request: vi.fn(),
      on: () => {},
      off: () => {},
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).window.ethereum = fakeProvider;

    const result = await detectSnapProvider();
    expect(result).toBeNull();
  });

  it('resolves to undefined when no provider is found after timeout', async () => {
    const result = await detectSnapProvider({ timeout: 10, silent: true });
    expect(result).toBeNull();
  });
});
