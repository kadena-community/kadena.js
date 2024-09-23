import { produce } from 'immer';
import { UserRejectedRequestError } from '@metamask/snaps-sdk';
import { ApiParams, SetAccountNameRequestParams } from '../types';
import { makeValidator } from '../utils/validate';

const validateParams = makeValidator({
  id: 'string',
  name: 'string',
});

const setAccountNameHelper = async (
  snapApi: ApiParams,
  type: 'default' | 'hardware',
): Promise<boolean> => {
  validateParams(snapApi.requestParams);

  const { id, name } = snapApi.requestParams as SetAccountNameRequestParams;

  const accounts =
    type === 'hardware'
      ? snapApi.state.hardwareAccounts
      : snapApi.state.accounts;

  const account = accounts.find((account) => account.id === id);
  if (!account) {
    throw new UserRejectedRequestError(`Account does not exist`);
  }

  const accountIndex = accounts.findIndex((account) => account.id === id);
  const newState = produce(snapApi.state, (draft) => {
    if (type === 'hardware') draft.hardwareAccounts[accountIndex].name = name;
    else draft.accounts[accountIndex].name = name;
  });

  await snapApi.wallet.request({
    method: 'snap_manageState',
    params: {
      operation: 'update',
      newState,
    },
  });

  snapApi.state = newState;

  return true;
};

export const setAccountName = async (snapApi: ApiParams): Promise<boolean> => {
  return setAccountNameHelper(snapApi, 'default');
};

export const setHardwareAccountName = async (
  snapApi: ApiParams,
): Promise<boolean> => {
  return setAccountNameHelper(snapApi, 'hardware');
};
