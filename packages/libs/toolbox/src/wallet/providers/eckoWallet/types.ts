import type { ISigningCap } from '@kadena/types';

import type { IPactCommand } from '@kadena/client';
import type { WalletAccount, WalletSigner } from '../../provider';

export interface KdaSendKadenaPayload {
  networkId: string;
  account: string;
  sourceChainId: string;
  chainId: string;
  amount: number;
}

export interface ISigningRequest {
  code: string;
  data?: Record<string, unknown>;
  caps: ISigningCap[];
  nonce?: string;
  chainId?: IPactCommand['meta']['chainId'];
  gasLimit?: number;
  gasPrice?: number;
  ttl?: number;
  sender?: string;
  extraSigners?: string[];
}

export interface Sig {
  publicKey: string;
  sig: string;
}

export interface CommandSignData {
  cmd: string;
  sigs: Sig[];
}

export interface KdaRequestSignPayload {
  networkId: string;
  signingCmd: ISigningRequest;
}
interface KdaRequestQuickSignPayload {
  networkId: string;
  commandSigDatas: CommandSignData[];
}

export interface KdaRequestSignRequest {
  method: 'kda_requestSign';
  data: KdaRequestSignPayload;
}

export interface KdaRequestQuickSignRequest {
  method: 'kda_requestQuickSign';
  data: KdaRequestQuickSignPayload;
}

export interface KdaSendKadenaRequest {
  method: 'kda_sendKadena';
  data: KdaSendKadenaPayload;
}

export interface KdaConnectRequest {
  method: 'kda_connect';
  networkId: string;
}

export interface KdaRequestAccountRequest {
  method: 'kda_requestAccount';
  networkId: string;
}

export interface KdaCheckStatusRequest {
  method: 'kda_checkStatus';
  networkId: string;
}

export interface KdaDisconnectRequest {
  method: 'kda_disconnect';
  networkId: string;
}

export interface KdaGetNetworkRequest {
  method: 'kda_getNetwork';
}

export type WalletRequest =
  | KdaRequestSignRequest
  | KdaRequestQuickSignRequest
  | KdaSendKadenaRequest
  | KdaConnectRequest
  | KdaRequestAccountRequest
  | KdaCheckStatusRequest
  | KdaDisconnectRequest
  | KdaGetNetworkRequest;

export type WalletRequestMethod = WalletRequest['method'];
export interface FailedResponse {
  status: 'fail';
  message: string;
}

export type SuccessResponse<T = {}> = {
  status: 'success';
  message: string;
} & T;

export type ConnectResponse =
  | FailedResponse
  | SuccessResponse<{
      account: WalletSigner;
    }>;

export type RequestAccountResponse =
  | FailedResponse
  | SuccessResponse<{
      wallet: WalletAccount;
    }>;

export type CheckStatusResponse = FailedResponse | SuccessResponse;

export type WalletEvent = 'res_accountChange' | 'kda_checkStatus';
export type AccountChangeEvent = SuccessResponse;
export interface WalletEventHandlers {
  res_accountChange: (event: AccountChangeEvent) => void;
  kda_checkStatus: (event: unknown) => void;
}

export interface WalletApi {
  isKadena: boolean;
  request<T = unknown>(request: WalletRequest): Promise<T>;
  on<E extends WalletEvent>(
    event: WalletEvent,
    callback: WalletEventHandlers[E],
  ): void;
}
