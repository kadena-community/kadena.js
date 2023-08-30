import { ICommand } from '@kadena/types';

import { IQuicksignResponseOutcomes } from '../../signing-api/v1/quicksign';
import { ISignFunction, ISingleSignFunction } from '../ISignFunction';

export type EckoStatus = 'success' | 'fail';

/**
 * Interface that describes the common functions to be used with Ecko Wallet
 * @public
 */
export interface ICommonEckoFunctions {
  isInstalled: () => boolean;
  isConnected: (networkId: string) => Promise<boolean>;
  connect: (networkId: string) => Promise<boolean>;
}
/**
 * Interface to use when writing a signing function for Ecko Wallet that accepts a single transaction
 * @public
 */
export interface IEckoSignSingleFunction
  extends ISingleSignFunction,
    ICommonEckoFunctions {}

/**
 * Interface to use when writing a signing function for Ecko Wallet that accepts multiple transactions
 * @public
 */
export interface IEckoSignFunction
  extends ISignFunction,
    ICommonEckoFunctions {}

export interface IEckoConnectOrStatusResponse {
  status: EckoStatus;
  message?: string;
  account?: {
    account: string;
    publicKey: string;
    connectedSites: string[];
  };
}

export interface IEckoSignResponse {
  status: EckoStatus;
  signedCmd: ICommand;
}

export interface IEckoQuicksignSuccessResponse {
  status: 'success';
  quickSignData: IQuicksignResponseOutcomes['responses'];
}

export interface IEckoQuicksignFailResponse {
  status: 'fail';
  error: string;
}

export type IEckoQuicksignResponse =
  | IEckoQuicksignSuccessResponse
  | IEckoQuicksignFailResponse;

export interface IEckoAccountsResponse {
  status: EckoStatus;
  message?: string;
  wallet?: {
    account: string;
    publicKey: string;
    connectedSites: string[];
    balance: number;
  };
}
