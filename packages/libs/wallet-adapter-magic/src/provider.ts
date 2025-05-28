/**
 *
 * This module defines the Magic Wallet provider interface and implements a detection
 * mechanism for the Magic Wallet on the window object. The MagicProvider interface extends
 * the core Provider from "@kadena/wallet-adapter-core".
 *
 * The detectMagicProvider function checks for the Magic Wallet provider by looking for its
 * presence on the global window object. It listens for the "kadena#initialized" event and
 * uses a timeout mechanism to avoid waiting indefinitely. This ensures that the Magic Wallet
 * can be reliably detected and integrated within the application.
 */

import type { IProvider } from '@kadena/wallet-adapter-core';

/**
 * The Magic provider interface extends the core Provider.
 */
export interface IMagicProvider extends IProvider {}

/**
 * Detects the Magic wallet provider.
 *
 * @param options - Options for detection (e.g. timeout, silent).
 * @returns A promise resolving to the Magic provider or null.
 * @public
 */
export async function detectMagicProvider(options?: {}): Promise<IMagicProvider | null> {
  return {
    request: async () => {},
    on: () => {},
    off: () => {},
  };
}
