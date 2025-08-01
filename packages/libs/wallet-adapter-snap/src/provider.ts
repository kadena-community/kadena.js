/**
 *
 * This module defines the Metamask Snap provider interface and implements a detection
 * mechanism for the Snap on the window object. The SnapProvider interface extends
 * the core Provider from "@kadena/wallet-adapter-core".
 *
 * The detectSnapProvider function checks for the Metamask Wallet provider by looking for its
 * presence on the global window object. It listens for the "kadena#initialized" event and
 * uses a timeout mechanism to avoid waiting indefinitely. This ensures that the wallet
 * can be reliably detected and integrated within the application.
 */

/**
 * Detects the Metamask Snap wallet provider.
 *
 * @param options - Options for detection (e.g. timeout, silent).
 * @returns A promise resolving to the Ecko provider or null.
 * @public
 */

import type { IProvider } from '@kadena/wallet-adapter-core';
import type { GetSnapsResult } from './types';
export const defaultSnapOrigin = `local:http://localhost:8080`;

export interface ISnapProvider extends IProvider {
  isMetaMask?: boolean;
}
/** @public */
export async function detectSnapProvider(options?: {
  silent?: boolean;
  timeout?: number;
}): Promise<ISnapProvider | null> {
  const { silent = false, timeout = 3000 } = options || {};

  return new Promise((resolve) => {
    let handled = false;

    async function handleProvider() {
      if (handled) return;
      handled = true;

      const provider = (window as any).ethereum as ISnapProvider | undefined;
      if (!provider || typeof provider.request !== 'function') {
        if (!silent) console.error('MetaMask provider not found');
        return resolve(null);
      }

      // First check it’s MetaMask
      if (!provider.isMetaMask) {
        if (!silent) console.error('Injected provider is not MetaMask');
        return resolve(null);
      }

      try {
        // See what snaps are installed
        const snaps = (await provider.request({
          method: 'wallet_getSnaps',
        })) as GetSnapsResult;

        console.log('SNAPS>:', JSON.stringify(snaps));
        // If our Kadena snap origin is in the list, we’ve succeeded
        if (snaps[defaultSnapOrigin]) {
          resolve(provider);
        } else {
          if (!silent)
            console.error(`Kadena Snap (${defaultSnapOrigin}) not installed`);
          resolve(null);
        }
      } catch (err) {
        if (!silent) console.error('Error fetching snaps', err);
        resolve(null);
      }
    }

    // If ethereum is already on window, go ahead and try
    if ((window as any).ethereum) {
      handleProvider();
    } else {
      // Otherwise wait for the injection event or timeout
      window.addEventListener('ethereum#initialized', handleProvider, {
        once: true,
      });
      setTimeout(handleProvider, timeout);
    }
  });
}
