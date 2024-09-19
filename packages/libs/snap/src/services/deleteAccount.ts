import { produce } from 'immer';
import {
  InvalidRequestError,
  UserRejectedRequestError,
} from '@metamask/snaps-sdk';
import { ApiParams, DeleteAccountRequestParams } from '../types';
import { makeValidator } from '../utils/validate';
import { heading, panel, text, divider } from '@metamask/snaps-ui';

const validateParams = makeValidator({
  id: 'string',
});

const deleteAccountHelper = async (
  snapApi: ApiParams,
  type: 'default' | 'hardware',
) => {
  validateParams(snapApi.requestParams);

  const accounts =
    type === 'hardware'
      ? snapApi.state.hardwareAccounts
      : snapApi.state.accounts;

  const { id } = snapApi.requestParams as DeleteAccountRequestParams;
  const accountIndex = accounts.findIndex((account) => account.id === id);

  if (accountIndex === -1) {
    throw new InvalidRequestError(`Account ${id} not found`);
  }

  const account = accounts[accountIndex];

  const confirm = await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: panel([
        heading(`Delete account`),
        text(
          `Do you want to allow ${snapApi.origin} to delete the following Kadena account?`,
        ),
        divider(),
        text(`Account: ${account.name}`),
        text(`Address: ${account.address}`),
      ]),
    },
  });

  if (!confirm) {
    throw new UserRejectedRequestError('Rejected delete account');
  }

  const newState = produce(snapApi.state, (draft) => {
    if (type === 'hardware') draft.hardwareAccounts.splice(accountIndex, 1);
    else draft.accounts.splice(accountIndex, 1);
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

export const deleteAccount = async (snapApi: ApiParams): Promise<boolean> => {
  return deleteAccountHelper(snapApi, 'default');
};

export const deleteHardwareAccount = async (
  snapApi: ApiParams,
): Promise<boolean> => {
  return deleteAccountHelper(snapApi, 'hardware');
};
