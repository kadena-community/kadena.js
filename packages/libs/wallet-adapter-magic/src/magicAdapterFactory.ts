import type {
  AdapterFactoryCreator,
  IBaseWalletFactoryOptions,
} from '@kadena/wallet-adapter-core';
import { MAGIC_ADAPTER } from './constants';
import type { IMagicAdapterOptions } from './MagicAdapter';
import { detectMagicProvider } from './provider';

/**
 * Magic Wallet Adapter Factory
 *
 * This function creates an Magic wallet adapter factory that detects the Magic wallet provider
 * and returns a new instance of the `MagicAdapter`. The adapter method **lazily** imports
 * the `MagicAdapter` class. `detect` is separated so `WalletAdapterClient` can use it
 * to detect the provider without creating an adapter instance.
 *
 * By using `await import("./MagicAdapter")`, this function only loads the Magic Wallet adapter code
 * when it is actually needed. This **lazy loading** can significantly reduce your initial bundle size,
 * especially in scenarios where multiple wallet adapters might be registered but not all of them
 * are necessarily used.
 *
 * @param options - The options object from BaseWalletAdapter
 * @returns A wallet adapter factory for the Magic wallet
 * @public
 */
export const createMagicAdapter = ((
  options: IMagicAdapterOptions & IBaseWalletFactoryOptions,
) => {
  return {
    name: MAGIC_ADAPTER,
    detect: async () => {
      return await detectMagicProvider();
    },
    adapter: async (provider) => {
      const { MagicAdapter } = await import('./MagicAdapter');
      return new MagicAdapter({ ...options, provider });
    },
  };
}) satisfies AdapterFactoryCreator;

export { MagicAdapter } from './MagicAdapter';
export { detectMagicProvider } from './provider';
