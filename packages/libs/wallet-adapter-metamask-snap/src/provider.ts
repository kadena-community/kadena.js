/**
 *
 * This module defines the MetaMask Snap provider interface and implements a detection
 * mechanism for the Snap on the window object. The SnapProvider interface extends
 * the core Provider from "@kadena/wallet-adapter-core".
 *
 * The detectSnapProvider function checks for the MetaMask Wallet provider by looking for its
 * presence on the global window object and uses a timeout mechanism to avoid waiting
 * indefinitely. Importantly, it does NOT perform any JSON‑RPC calls (e.g. wallet_getSnaps)
 * during detection, so MetaMask will not prompt the user to unlock here. All unlock/install
 * prompts are deferred to the connection flow inside the adapter.
 */

import type { IProvider } from '@kadena/wallet-adapter-core';
export const defaultSnapOrigin = `npm:@mindsend/kadena-snap`;

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

      // Do not perform any RPC here to avoid unlock prompts.
      // Presence of MetaMask is enough for detection; snap install/state
      // will be handled during the adapter's connect flow.
      return resolve(provider);
    }

    if ((window as any).ethereum) {
      handleProvider().catch((err) => console.log(err));
    } else {
      window.addEventListener('ethereum#initialized', handleProvider, {
        once: true,
      });
      setTimeout(handleProvider, timeout);
    }
  });
}
