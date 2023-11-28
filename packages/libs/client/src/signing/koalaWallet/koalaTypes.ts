import type { ICommand } from '@kadena/types';
import type { IQuicksignResponseOutcomes } from '../../signing-api/v1/quicksign';
import type { ISignFunction, ISingleSignFunction } from '../ISignFunction';

export type KoalaStatus = 'success' | 'fail';

/**
 * Interface that describes the common functions to be used with Koala Wallet
 * @public
 */
export interface ICommonKoalaFunctions {
  isInstalled: () => boolean;
  isConnected: (networkId: string) => Promise<boolean>;
  connect: (networkId: string) => Promise<boolean>;
}
/**
 * Interface to use when writing a signing function for Koala Wallet that accepts a single transaction
 * @public
 */
export interface IKoalaSignSingleFunction
  extends ISingleSignFunction,
    ICommonKoalaFunctions {}

/**
 * Interface to use when writing a signing function for Koala Wallet that accepts multiple transactions
 * @public
 */
export interface IKoalaSignFunction
  extends ISignFunction,
    ICommonKoalaFunctions {}

export interface IKoalaConnectOrStatusResponse {
  status: KoalaStatus;
  message?: string;
  account?: {
    account: string;
    publicKey: string;
    connectedSites: string[];
  };
}

export interface IKoalaSignResponse {
  status: KoalaStatus;
  signedCmd: ICommand;
}

export interface IKoalaQuicksignSuccessResponse {
  status: 'success';
  quickSignData: IQuicksignResponseOutcomes['responses'];
}

export interface IKoalaQuicksignFailResponse {
  status: 'fail';
  error: string;
}

export type IKoalaQuicksignResponse =
  | IKoalaQuicksignSuccessResponse
  | IKoalaQuicksignFailResponse;

export interface IKoalaAccountsResponse {
  status: KoalaStatus;
  message?: string;
  wallet?: {
    account: string;
    publicKey: string;
    connectedSites: string[];
    balance: number;
  };
}
