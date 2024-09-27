import { produce } from 'immer';
import {
  UserRejectedRequestError,
  InvalidRequestError,
} from '@metamask/snaps-sdk';
import { heading, panel, text, divider } from '@metamask/snaps-ui';
import { ApiParams, Network, StoreNetworkRequestParams } from '../types';
import renderNetwork from '../utils/renderNetwork';
import { makeValidator } from '../utils/validate';
import { nanoid } from 'nanoid';

const validateParams = makeValidator({ network: 'object' });
const validateNetwork = makeValidator({
  name: 'string',
  networkId: 'string',
  nodeUrl: 'string',
  isTestnet: 'boolean',
  transactionListUrl: 'string',
  transactionListTtl: 'number',
  blockExplorerAddress: 'string',
  blockExplorerTransaction: 'string',
  blockExplorerAddressTransactions: 'string',
  buyPageUrl: 'string',
});

export const storeNetwork = async (snapApi: ApiParams): Promise<Network> => {
  validateParams(snapApi.requestParams);

  const { network } = snapApi.requestParams as StoreNetworkRequestParams;
  validateNetwork(network);

  const { origin } = snapApi;

  const { name } = network;

  const exists = snapApi.state.networks.find(
    ({ name: existingName }) =>
      existingName.toLowerCase() === name.toLowerCase(),
  );
  if (exists) {
    throw new InvalidRequestError(`Network ${network.name} already exists`);
  }

  const newNetwork: Network = {
    ...network,
    id: nanoid(),
  };

  const confirm = await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'confirmation',
      content: panel([
        heading(`Adding custom network`),
        text(
          `Do you want to allow ${origin} to add the following custom Kadena network?`,
        ),
        divider(),
        ...renderNetwork(newNetwork),
      ]),
    },
  });

  if (!confirm) {
    throw new UserRejectedRequestError('Rejected by user');
  }

  const newState = produce(snapApi.state, (draft) => {
    draft.networks.push(newNetwork);
  });

  await snapApi.wallet.request({
    method: 'snap_manageState',
    params: {
      operation: 'update',
      newState,
    },
  });

  snapApi.state = newState;

  return newNetwork;
};
