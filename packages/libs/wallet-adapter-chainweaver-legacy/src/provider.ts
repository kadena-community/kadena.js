/**
 *
 * This module defines the ChainWeaver Legacy Wallet provider interface and implements a detection
 * mechanism for ChainWeaver Legacy. The ChainweaverProvider interface extends
 * the core Provider from "@kadena/wallet-adapter-core".
 *
 */

import { IProvider } from '@kadena/wallet-adapter-core';

export interface IChainweaverProviderLegacy extends IProvider {}

/**
 * Detects the Chainweaver Legacy wallet provider.
 *
 * @param options - Options for detection (e.g. timeout, silent).
 * @returns A promise resolving to the Chainweaver Legacy provider or null.
 * @public
 */
export async function detectChainweaverProviderLegacy(options?: {
  silent?: boolean;
  timeout?: number;
}): Promise<IChainweaverProviderLegacy | null> {
  const { silent, timeout } = options ?? {};

  if (silent !== undefined && typeof silent !== 'boolean') {
    throw new Error('Expected option "silent" to be a boolean.');
  }

  if (timeout !== undefined && typeof timeout !== 'number') {
    throw new Error('Expected option "timeout" to be a number.');
  }

  const provider: IChainweaverProviderLegacy = {
    request: async () => {},
    on: () => {},
    off: () => {},
  };
  return provider;
}
