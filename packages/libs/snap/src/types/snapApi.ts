import { Snap } from './snap';
import { Network, SnapState } from './snapState';

export interface ApiParams {
  state: SnapState;
  requestParams: ApiRequestParams;
  wallet: Snap;
  origin: string;
}

export type ApiRequestParams =
  | DeriveAccountRequestParams
  | GetAccountsRequestParams
  | StoreAddressRequestParams
  | SetActiveNetworkRequestParams
  | SetAccountNameRequestParams
  | DeleteAccountRequestParams
  | StoreNetworkRequestParams
  | DeleteNetworkRequestParams
  | SignTransactionRequestParams
  | AddHardwareAccountRequestParams;

export type DeriveAccountRequestParams = Record<string, never>;

export type GetAccountsRequestParams = Record<string, never>;

export type StoreAddressRequestParams = Record<string, never>;

export type SetActiveNetworkRequestParams = {
  id: string;
};

export type SetAccountNameRequestParams = {
  id: string;
  name: string;
};

export type DeleteAccountRequestParams = {
  id: string;
};

export type StoreNetworkRequestParams = {
  network: Omit<Network, 'id'>;
};

export type DeleteNetworkRequestParams = {
  id: string;
};

export type SignTransactionRequestParams = {
  id: string;
  transaction: string;
};

export type AddHardwareAccountRequestParams = {
  index: number;
  address: string;
  publicKey: string;
};
