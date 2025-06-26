import type {
  AdapterFactoryCreator,
  IBaseWalletFactoryOptions,
} from '@kadena/wallet-adapter-core';
import { detectChainweaverProvider } from './provider';

/**
 * ChainWeaver Wallet Adapter Factory
 *
 * This function creates an ChainWeaver wallet adapter factory that detects the ChainWeaver wallet provider
 * and returns a new instance of the `ChainweaverAdapter`. The adapter method **lazily** imports
 * the `ChainweaverAdapter` class. `detect` is seperated so `WalletAdapterClient` can use it
 * to detect the provider without creating an adapter instance.
 *
 * By using `await import("./ChainweaverAdapter")`, this function only loads the ChainWeaver Wallet adapter code
 * when it is actually needed. This **lazy loading** can significantly reduce your initial bundle size,
 * especially in scenarios where multiple wallet adapters might be registered but not all of them
 * are necessarily used.
 *
 * @param options - The options object from BaseWalletAdapter
 * @returns A wallet adapter factory for the Chainweaver wallet
 * @public
 */
export const createChainweaverAdapter = ((
  options?: IBaseWalletFactoryOptions,
) => {
  return {
    name: 'Chainweaver',
    detect: async () => {
      return await detectChainweaverProvider();
    },
    adapter: async (provider) => {
      const { ChainweaverAdapter } = await import('./ChainweaverAdapter');
      return new ChainweaverAdapter({ ...options, provider });
    },
  };
}) satisfies AdapterFactoryCreator;

export { ChainweaverAdapter } from './ChainweaverAdapter';
export { detectChainweaverProvider } from './provider';
