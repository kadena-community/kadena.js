import { ApiParams } from '../types';

export const getActiveNetwork = (snapApi: ApiParams): string => {
  return snapApi.state.activeNetwork;
};
