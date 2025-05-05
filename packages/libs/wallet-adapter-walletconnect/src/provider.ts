import {
  IBaseWalletAdapterOptions,
  IProvider,
} from '@kadena/wallet-adapter-core';
import { SessionTypes } from '@walletconnect/types';

/**
 * WalletConnectKadenaProvider interface
 *
 * If WalletConnect is not set, detection can fallback or return null.
 */
export interface WalletConnectAdapterOptions extends IBaseWalletAdapterOptions {
  relayUrl: string;
  projectId: string;
}

export interface WalletConnectProvider extends IProvider {
  connected: boolean;
  accounts: string[];
  session?: SessionTypes.Struct;
}

export async function detectWalletConnectProvider(options?: {
  silent?: boolean;
  timeout?: number;
}): Promise<WalletConnectProvider | null> {
  const { silent, timeout } = options ?? {};

  if (silent !== undefined && typeof silent !== 'boolean') {
    throw new Error('Expected option "silent" to be a boolean.');
  }

  if (timeout !== undefined && typeof timeout !== 'number') {
    throw new Error('Expected option "timeout" to be a number.');
  }

  const provider: WalletConnectProvider = {
    connected: false,
    accounts: [],
    request: async () => {},
    on: () => {},
    off: () => {},
  };
  return provider;
}
