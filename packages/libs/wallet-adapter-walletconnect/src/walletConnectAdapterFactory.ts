import type {
  AdapterFactoryCreator,
  IBaseWalletFactoryOptions,
} from '@kadena/wallet-adapter-core';
import { detectWalletConnectProvider } from './provider';

export interface IWalletConnectFactoryOptions
  extends IBaseWalletFactoryOptions {
  relayUrl?: string;
  projectId?: string;
}

/**
 * WalletConnect Adapter Factory
 *
 * This function creates a WalletConnect adapter factory that detects the WalletConnect provider
 * and returns a new instance of the `WalletConnectAdapter`. The adapter method **lazily** imports
 * the `WalletConnectAdapter` class. The `detect` function is separated so that the `WalletAdapterClient`
 * can check for the provider without instantiating the adapter.
 *
 * By using `await import("./WalletConnectAdapter")`, the adapter code for WalletConnect is only loaded
 * when it is actually needed. This **lazy loading** approach helps reduce your initial bundle size,
 * especially when multiple wallet adapters might be registered but not all are necessarily used.
 *
 * @param options The options object from BaseWalletAdapter.
 * @returns An object containing the adapter factory details for WalletConnect.
 */
export const walletConnectAdapter = ((
  options?: IWalletConnectFactoryOptions,
) => {
  return {
    name: 'WalletConnect',
    detect: async () => {
      return await detectWalletConnectProvider({ silent: true });
    },
    adapter: async (provider) => {
      const { WalletConnectAdapter } = await import('./WalletConnectAdapter');
      return new WalletConnectAdapter({ ...options, provider });
    },
  };
}) satisfies AdapterFactoryCreator;
