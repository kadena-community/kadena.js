import { ApiParams } from '../types';

export const getAccounts = (snapApi: ApiParams) => {
  return snapApi.state.accounts;
};

export const getHardwareAccounts = (snapApi: ApiParams) => {
  return snapApi.state.hardwareAccounts;
};
