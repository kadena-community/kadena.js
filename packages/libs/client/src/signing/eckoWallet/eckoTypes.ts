import { ICommand } from '@kadena/types';

import { IQuicksignResponseOutcomes } from '../../signing-api/v1/quicksign';

export type EckoStatus = 'success' | 'fail';

export interface ICommonEckoFunctions {
  isInstalled: () => boolean;
  isConnected: (networkId: string) => Promise<boolean>;
  connect: (networkId: string) => Promise<boolean>;
}

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
