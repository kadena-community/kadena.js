import type {
  AdapterFactoryCreator,
  IBaseWalletFactoryOptions,
} from '@kadena/wallet-adapter-core';
import { detectChainweaverLegacyProvider } from './provider';

/**
 * ChainWeaver Wallet Adapter Factory
 *
 * This function creates an ChainWeaver wallet adapter factory that detects the ChainWeaver wallet provider
 * and returns a new instance of the `ChainweaverAdapterLegacy`. The adapter method **lazily** imports
 * the `ChainweaverAdapterLegacy` class. `detect` is seperated so `WalletAdapterClient` can use it
 * to detect the provider without creating an adapter instance.
 *
 * By using `await import("./ChainweaverAdapterLegacy")`, this function only loads the ChainWeaver Wallet adapter code
 * when it is actually needed. This **lazy loading** can significantly reduce your initial bundle size,
 * especially in scenarios where multiple wallet adapters might be registered but not all of them
 * are necessarily used.
 *
 * @param options - The options object from BaseWalletAdapter
 * @returns A wallet adapter factory for the Chainweaver Legacy wallet
 * @public
 */
export const createChainweaverLegacyAdapter = ((
  options?: IBaseWalletFactoryOptions,
) => {
  return {
    name: 'ChainweaverLegacy',
    detect: async () => {
      return await detectChainweaverLegacyProvider({ silent: true });
    },
    adapter: async (provider) => {
      const { ChainweaverLegacyAdapter } = await import(
        './ChainweaverLegacyAdapter'
      );
      return new ChainweaverLegacyAdapter({ ...options, provider });
    },
  };
}) satisfies AdapterFactoryCreator;

export { ChainweaverLegacyAdapter } from './ChainweaverLegacyAdapter';
export { detectChainweaverLegacyProvider } from './provider';
