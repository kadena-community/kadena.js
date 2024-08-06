import type { ICommand } from '@kadena/types';
import type { IQuicksignResponseOutcomes } from '../../signing-api/v1/quicksign';
import type { ISignFunction, ISingleSignFunction } from '../ISignFunction';

/**
 * The response status of the Ecko Wallet request
 * @public
 */
export type EckoStatus = 'success' | 'fail';

/**
 * Interface that describes the common functions to be used with Ecko Wallet
 * @public
 */
export interface ICommonEckoFunctions {
  isInstalled: () => boolean;
  isConnected: (networkId: string) => Promise<boolean>;
  connect: (networkId: string) => Promise<boolean>;
  checkStatus: (
    networkId: string,
  ) => Promise<IEckoConnectOrStatusResponse | undefined>;
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

/**
 * Interface that describes the response from Ecko Wallet when checking status or connecting
 * @public
 */
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

type IEckoQuicksignSuccessResponse = {
  status: 'success';
} & (
  | {
      // in old versions of Ecko Wallet, the response was called quickSignData
      quickSignData: IQuicksignResponseOutcomes['responses'];
    }
  | {
      responses: IQuicksignResponseOutcomes['responses'];
    }
);

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
