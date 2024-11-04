import { produce } from 'immer';
import { heading, panel, text, divider } from '@metamask/snaps-ui';
import {
  UserRejectedRequestError,
  InvalidRequestError,
} from '@metamask/snaps-sdk';
import { ApiParams, DeleteNetworkRequestParams } from '../types';
import renderNetwork from '../utils/renderNetwork';
import { makeValidator } from '../utils/validate';

const validateParams = makeValidator({
  id: 'string',
});

export const deleteNetwork = async (snapApi: ApiParams): Promise<boolean> => {
  validateParams(snapApi.requestParams);

  const { origin } = snapApi;
  const { id } = snapApi.requestParams as DeleteNetworkRequestParams;

  if (snapApi.state.networks.length === 1) {
    throw new InvalidRequestError('Cannot delete the only network');
  }

  const network = snapApi.state.networks.find((network) => network.id === id);

  if (!network) {
    throw new InvalidRequestError('Network does not exist');
  }

  if (snapApi.state.activeNetwork === network.id) {
    throw new InvalidRequestError('Cannot delete the active network');
  }

  const confirm = await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: panel([
        heading(`Delete custom network`),
        text(
          `Do you want to allow ${origin} to delete the following Kadena network?`,
        ),
        divider(),
        ...renderNetwork(network),
      ]),
    },
  });

  if (!confirm) {
    throw new UserRejectedRequestError('Rejected delete network');
  }

  const networkIndex = snapApi.state.networks.findIndex(
    (network) => network.id === id,
  );
  const newState = produce(snapApi.state, (draft) => {
    draft.networks.splice(networkIndex, 1);
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
