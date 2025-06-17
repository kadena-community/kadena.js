import type { IProvider } from '@kadena/wallet-adapter-core';
import { vi } from 'vitest';

export class MockProvider implements IProvider {
  public request: (args: {
    method: string;
    [key: string]: unknown;
  }) => Promise<unknown> = vi.fn();
  public on: (event: string, listener: (...args: unknown[]) => void) => void =
    vi.fn();
  public off: (event: string, listener: (...args: unknown[]) => void) => void =
    vi.fn();
}
