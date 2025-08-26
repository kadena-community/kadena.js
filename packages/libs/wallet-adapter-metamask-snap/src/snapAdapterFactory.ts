import type {
  AdapterFactoryCreator,
  IBaseWalletFactoryOptions,
} from '@kadena/wallet-adapter-core';
import { detectSnapProvider } from './provider';

/**
 * MetaMask Snap Adapter Factory
 *
 * This function creates a MetaMask Snap wallet adapter factory that detects
 * the MetaMask provider with your Kadena Snap installed and returns a new
 * instance of the `SnapAdapter`. Detection is split out so that the
 * `WalletAdapterClient` can probe for the Snap without instantiating the adapter.
 *
 * By using `await import("./SnapAdapter")`, this factory only loads the
 * Snap adapter code when it’s actually needed. This **lazy loading** can
 * significantly reduce your initial bundle size, especially if you
 * register multiple wallet adapters but only use one in a given session.
 *
 * @param options - Configuration options for the adapter (e.g. `silent`, `timeout`)
 * @returns A wallet adapter factory for the MetaMask Kadena Snap
 * @public
 */

export const createSnapAdapter = ((options?: IBaseWalletFactoryOptions) => {
  return {
    name: 'Snap',
    detect: async () => {
      return await detectSnapProvider({ silent: true });
    },
    adapter: async (provider) => {
      const { SnapAdapter } = await import('./SnapAdapter');
      return new SnapAdapter({ ...options, provider });
    },
  };
}) satisfies AdapterFactoryCreator;

export { detectSnapProvider } from './provider';
export { SnapAdapter } from './SnapAdapter';
