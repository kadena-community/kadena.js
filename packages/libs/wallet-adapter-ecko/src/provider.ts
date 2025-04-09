/**
 *
 * This module defines the Ecko Wallet provider interface and implements a detection
 * mechanism for the Ecko Wallet on the window object. The EckoProvider interface extends
 * the core Provider from "@kadena/wallet-adapter-core".
 *
 * The detectEckoProvider function checks for the Ecko Wallet provider by looking for its
 * presence on the global window object. It listens for the "kadena#initialized" event and
 * uses a timeout mechanism to avoid waiting indefinitely. This ensures that the Ecko Wallet
 * can be reliably detected and integrated within the application.
 */

import type { Provider } from '@kadena/wallet-adapter-core';

/**
 * The Ecko provider interface extends the core Provider.
 */
export interface EckoProvider extends Provider {
  isKadena?: boolean;
}

/**
 * Detects the Ecko wallet provider.
 *
 * @param options - Options for detection (e.g. timeout, silent).
 * @returns A promise resolving to the Ecko provider or null.
 * @public
 */
export async function detectEckoProvider(options?: {
  silent?: boolean;
  timeout?: number;
}): Promise<EckoProvider | null> {
  const { silent = false, timeout = 3000 } = options || {};
  return new Promise((resolve) => {
    let handled = false;
    function handleProvider() {
      if (handled) return;
      handled = true;
      const provider = (window as any).kadena as EckoProvider;
      if (
        provider &&
        provider.isKadena &&
        typeof provider.request === 'function'
      ) {
        resolve(provider);
      } else {
        if (!silent) console.error('Ecko Wallet not detected');
        resolve(null);
      }
    }
    if ((window as any).kadena) {
      handleProvider();
    } else {
      window.addEventListener('kadena#initialized', handleProvider, {
        once: true,
      });
      setTimeout(handleProvider, timeout);
    }
  });
}
