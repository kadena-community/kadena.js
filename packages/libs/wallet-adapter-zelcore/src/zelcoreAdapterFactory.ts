import type {
  AdapterFactoryCreator,
  IBaseWalletFactoryOptions,
} from '@kadena/wallet-adapter-core';
import { detectZelcoreProvider } from './provider';

/**
 * Zelcore Wallet Adapter Factory
 *
 * This function creates an Zelcore wallet adapter factory that detects the Zelcore wallet provider
 * and returns a new instance of the `ZelcoreAdapter`. The adapter method **lazily** imports
 * the `ZelcoreAdapter` class. `detect` is seperated so `WalletAdapterClient` can use it
 * to detect the provider without creating an adapter instance.
 *
 * By using `await import("./ZelcoreAdapter")`, this function only loads the Zelcore Wallet adapter code
 * when it is actually needed. This **lazy loading** can significantly reduce your initial bundle size,
 * especially in scenarios where multiple wallet adapters might be registered but not all of them
 * are necessarily used.
 *
 * @param options - The options object from BaseWalletAdapter
 * @returns A wallet adapter factory for the Zelcore  wallet
 * @public
 */
export const createZelcoreAdapter = ((options?: IBaseWalletFactoryOptions) => {
  return {
    name: 'Zelcore',
    detect: async () => {
      return await detectZelcoreProvider({ silent: true });
    },
    adapter: async (provider) => {
      const { ZelcoreAdapter } = await import('./ZelcoreAdapter');
      return new ZelcoreAdapter({ ...options, provider });
    },
  };
}) satisfies AdapterFactoryCreator;

export { detectZelcoreProvider } from './provider';
export { ZelcoreAdapter } from './ZelcoreAdapter';
