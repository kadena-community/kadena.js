/**
 *
 * This module defines the MetaMask Snap provider interface and implements a detection
 * mechanism for the Snap on the window object. The SnapProvider interface extends
 * the core Provider from "@kadena/wallet-adapter-core".
 *
 * The detectSnapProvider function checks for the MetaMask Wallet provider by looking for its
 * presence on the global window object, installs the Snap if missing, and uses a timeout
 * mechanism to avoid waiting indefinitely. This ensures that the wallet can be reliably
 * detected and integrated within the application.
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
      console.log('provider:', provider);
      if (!provider || typeof provider.request !== 'function') {
        if (!silent) console.error('MetaMask provider not found');
        return resolve(null);
      }

      if (!provider.isMetaMask) {
        if (!silent) console.error('Injected provider is not MetaMask');
        return resolve(null);
      }

      try {
        // Check installed snaps
        let snaps = (await provider.request({
          method: 'wallet_getSnaps',
        })) as GetSnapsResult;
        console.log('SNAPS>:', snaps);

        // If Kadena Snap isn't installed, request installation
        if (!snaps[defaultSnapOrigin]) {
          if (!silent)
            console.log(
              `Requesting installation of Snap at ${defaultSnapOrigin}`,
            );
          await provider.request({
            method: 'wallet_requestSnaps',
            params: { [defaultSnapOrigin]: { version: '*' } },
          });

          snaps = (await provider.request({
            method: 'wallet_getSnaps',
          })) as GetSnapsResult;
          console.log('SNAPS after request>:', snaps);
        }

        if (snaps[defaultSnapOrigin]) {
          return resolve(provider);
        }

        if (!silent)
          console.error(`Kadena Snap (${defaultSnapOrigin}) not installed`);
        resolve(null);
      } catch (err) {
        if (!silent) console.error('Error fetching or installing snaps', err);
        resolve(null);
      }
    }

    if ((window as any).ethereum) {
      handleProvider();
    } else {
      window.addEventListener('ethereum#initialized', handleProvider, {
        once: true,
      });
      setTimeout(handleProvider, timeout);
    }
  });
}
