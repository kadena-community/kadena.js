import type {
  IBaseWalletAdapterOptions,
  IProvider,
} from '@kadena/wallet-adapter-core';
import type { SessionTypes } from '@walletconnect/types';

/**
 * WalletConnectKadenaProvider interface
 *
 * If WalletConnect is not set, detection can fallback or return null.
 */
export interface IWalletConnectAdapterOptions
  extends IBaseWalletAdapterOptions {
  relayUrl: string;
  projectId: string;
}

export interface IWalletConnectProvider extends IProvider {
  connected: boolean;
  accounts: string[];
  session?: SessionTypes.Struct;
}

/**
 * Provide a mock for wallet connect, since this modal needs to be dynamically built
 * it will be re-created inside the adapter, and we can safely assume it is always available.
 *
 * @returns A promise resolving to the WalletConnect provider or null.
 * @public
 */
export async function detectWalletConnectProvider(): Promise<IWalletConnectProvider | null> {
  const provider: IWalletConnectProvider = {
    connected: false,
    accounts: [],
    request: async () => {},
    on: () => {},
    off: () => {},
  };
  return provider;
}
