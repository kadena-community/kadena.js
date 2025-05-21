import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { IEckoProvider } from '../provider';
import { detectMagicProvider } from '../provider';

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
    const fakeProvider: IEckoProvider = {
      isKadena: true,
      request: () => Promise.resolve(),
      on: () => {},
      off: () => {},
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any).window.kadena = fakeProvider;

    const result = await detectMagicProvider();
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

    const result = await detectMagicProvider();
    expect(result).toBeNull();
  });

  it('resolves to null when no provider is found after timeout', async () => {
    const result = await detectMagicProvider({ timeout: 10, silent: true });
    expect(result).toBeNull();
  });
});
