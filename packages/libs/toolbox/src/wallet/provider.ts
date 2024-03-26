import type { ISignFunction, ISingleSignFunction } from '@kadena/client';

export interface WalletNetwork {
  explorer?: string;
  id: string;
  isDefault: boolean;
  name: string;
  networkId: string;
  url: string;
}

export interface WalletSigner {
  address: string;
  publicKey: string;
}

export interface WalletAccount extends WalletSigner {
  connectedSites: string[];
  balance: number;
}

export interface WalletSigningApi {
  sign: ISingleSignFunction;
  quickSign: ISignFunction;
}

export interface WalletProvider extends WalletSigningApi {
  isInstalled(): boolean;
  connect(networkId?: string): Promise<WalletSigner>;
  getSigner(networkId?: string): Promise<WalletSigner>;
  getNetwork(): Promise<WalletNetwork>;
  isConnected(networkId?: string): Promise<boolean>;
  getAccountDetails(networkId?: string): Promise<WalletAccount>;
  disconnect(networkId?: string): Promise<void>;
}
