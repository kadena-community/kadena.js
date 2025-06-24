/**
 *
 * This module defines the Zelcore Wallet provider interface and implements a detection
 * mechanism for Zelcore. The Zelcore Provider interface extends
 * the core Provider from "@kadena/wallet-adapter-core".
 *
 */

import type { IProvider } from '@kadena/wallet-adapter-core';

export interface IZelcoreProvider extends IProvider {}

/**
 * Detects the Zelcore wallet provider.
 *
 * @param options - Options for detection (e.g. timeout, silent).
 * @returns A promise resolving to the Zelcore provider or null.
 * @public
 */
export async function detectZelcoreProvider(options?: {
  silent?: boolean;
  timeout?: number;
  // eslint-disable-next-line @rushstack/no-new-null
}): Promise<IZelcoreProvider | null> {
  const { silent, timeout } = options ?? {};

  if (silent !== undefined && typeof silent !== 'boolean') {
    throw new Error('Expected option "silent" to be a boolean.');
  }

  if (timeout !== undefined && typeof timeout !== 'number') {
    throw new Error('Expected option "timeout" to be a number.');
  }

  const provider: IZelcoreProvider = {
    request: async () => {},
    on: () => {},
    off: () => {},
  };
  return provider;
}
