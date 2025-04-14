import type {
  AdapterFactoryCreator,
  BaseWalletFactoryOptions,
} from '@kadena/wallet-adapter-core';
import { detectEckoProvider } from './provider';

/**
 * Ecko Wallet Adapter Factory
 *
 * This function creates an Ecko wallet adapter factory that detects the Ecko wallet provider
 * and returns a new instance of the `EckoWalletAdapter`. The adapter method **lazily** imports
 * the `EckoWalletAdapter` class. `detect` is seperated so `WalletAdapterClient` can use it
 * to detect the provider without creating an adapter instance.
 *
 * By using `await import("./EckoWalletAdapter")`, this function only loads the Ecko Wallet adapter code
 * when it is actually needed. This **lazy loading** can significantly reduce your initial bundle size,
 * especially in scenarios where multiple wallet adapters might be registered but not all of them
 * are necessarily used.
 *
 * @param options - The options object from BaseWalletAdapter
 * @returns A wallet adapter factory for the Ecko wallet
 * @public
 */
export const eckoAdapter = ((options?: BaseWalletFactoryOptions) => {
  return {
    name: 'Ecko',
    detect: async () => {
      return await detectEckoProvider({ silent: true });
    },
    adapter: async (provider) => {
      const { EckoWalletAdapter } = await import('./EckoWalletAdapter');
      return new EckoWalletAdapter({ ...options, provider });
    },
  };
}) satisfies AdapterFactoryCreator;

export { EckoWalletAdapter } from './EckoWalletAdapter';
export { detectEckoProvider } from './provider';
