import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { EckoProvider } from '../provider';
import { detectEckoProvider } from '../provider';

describe('detectEckoProvider', () => {
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

  it('resolves to provider when window.kadena exists and isKadena true', async () => {
    const fakeProvider: EckoProvider = {
      isKadena: true,
      request: () => Promise.resolve(),
      on: () => {},
      off: () => {},
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).window.kadena = fakeProvider;

    const result = await detectEckoProvider();
    expect(result).toBe(fakeProvider);
  });

  it('resolves to null when window.kadena exists but isKadena false', async () => {
    const fakeProvider = {
      isKadena: false,
      request: () => Promise.resolve(),
      on: () => {},
      off: () => {},
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).window.kadena = fakeProvider;

    const result = await detectEckoProvider();
    expect(result).toBeNull();
  });

  it('resolves to null when no provider is found after timeout', async () => {
    const result = await detectEckoProvider({ timeout: 10, silent: true });
    expect(result).toBeNull();
  });
});
