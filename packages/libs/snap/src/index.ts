import { MethodNotFoundError } from '@metamask/snaps-sdk';
import type { OnRpcRequestHandler } from '@metamask/snaps-sdk';
import {
  addAccount,
  addHardwareAccount,
  deleteAccount,
  deleteNetwork,
  derive,
  getAccounts,
  getActiveNetwork,
  setActiveNetwork,
  getNetworks,
  setAccountName,
  signTransaction,
  storeNetwork,
  getHardwareAccounts,
  setHardwareAccountName,
  deleteHardwareAccount,
} from './services';
import { ApiParams, ApiRequestParams, Snap, SnapState } from './types';
import { BASE_ACCOUNT_NAME } from './utils/constants';
import createDefaultNetworks from './utils/createDefaultNetworks';
import { nanoid } from 'nanoid';

export { onHomePage } from './home';

declare const snap: Snap;

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({
  origin,
  request,
}) => {
  const requestParams = { ...request?.params } as ApiRequestParams;

  let state = (await snap.request({
    method: 'snap_manageState',
    params: {
      operation: 'get',
    },
  })) as SnapState;

  if (!state) {
    const defaultAccount = await derive(0);
    const networks = createDefaultNetworks();
    state = {
      networks,
      activeNetwork: networks[0].id,
      accounts: [
        {
          id: nanoid(),
          index: defaultAccount.index,
          address: defaultAccount.address,
          publicKey: defaultAccount.publicKey,
          name: `${BASE_ACCOUNT_NAME} 1`,
        },
      ],
      hardwareAccounts: [],
    };

    await snap.request({
      method: 'snap_manageState',
      params: {
        operation: 'update',
        newState: state,
      },
    });
  }

  if (request.method === 'kda_checkConnection') {
    return true;
  }

  const snapApi: ApiParams = {
    state,
    wallet: snap,
    origin,
    requestParams,
  };

  switch (request.method) {
    case 'kda_getAccounts':
      return getAccounts(snapApi);
    case 'kda_getHardwareAccounts':
      return getHardwareAccounts(snapApi);
    case 'kda_addAccount':
      return addAccount(snapApi);
    case 'kda_addHardwareAccount':
      return addHardwareAccount(snapApi);
    case 'kda_getActiveNetwork':
      return getActiveNetwork(snapApi);
    case 'kda_setActiveNetwork':
      return setActiveNetwork(snapApi);
    case 'kda_setAccountName':
      return setAccountName(snapApi);
    case 'kda_setHardwareAccountName':
      return setHardwareAccountName(snapApi);
    case 'kda_deleteAccount':
      return deleteAccount(snapApi);
    case 'kda_deleteHardwareAccount':
      return deleteHardwareAccount(snapApi);
    case 'kda_getNetworks':
      return getNetworks(snapApi);
    case 'kda_storeNetwork':
      return storeNetwork(snapApi);
    case 'kda_deleteNetwork':
      return deleteNetwork(snapApi);
    case 'kda_signTransaction':
      return signTransaction(snapApi);

    default:
      throw new MethodNotFoundError('Method not found.');
  }
};
