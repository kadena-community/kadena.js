import { signingRequestToPactCommand } from '../../utils';
import { ToolboxWalletProvider } from '../toolbox';
import type {
  KdaCheckStatusRequest,
  KdaConnectRequest,
  KdaDisconnectRequest,
  KdaRequestAccountRequest,
  KdaRequestSignRequest,
  WalletApi,
  WalletRequest,
} from './types';

const toolboxWallet = new ToolboxWalletProvider();

async function handleKdaConnect(request: KdaConnectRequest) {
  const account = await toolboxWallet.connect(request.networkId);
  return {
    status: 'success',
    account,
  };
}

async function handleKdaRequestAccount(request: KdaRequestAccountRequest) {
  const wallet = await toolboxWallet.getAccountDetails(request.networkId);
  return {
    status: 'success',
    wallet,
  };
}

async function handleKdaCheckStatus(request: KdaCheckStatusRequest) {
  const isConnected = await toolboxWallet.isConnected();
  const wallet = isConnected
    ? await toolboxWallet.getAccountDetails(request.networkId)
    : null;
  return {
    status: isConnected ? 'success' : 'fail',
    message: isConnected ? 'connected' : 'disconnected',
    wallet,
  };
}

async function handleKdaDisconnect(request: KdaDisconnectRequest) {
  await toolboxWallet.disconnect(request.networkId);
  return {
    status: 'success',
    message: 'disconnected',
  };
}

async function handleKdaSign(request: KdaRequestSignRequest) {
  const cmd = signingRequestToPactCommand(
    request,
    await toolboxWallet.getSigner(),
  );
  const signedCmd = await toolboxWallet.sign(cmd);
  return {
    status: 'success',
    signedCmd,
  };
}

// async function handleKdaQuickSign(request: WalletRequest) {
//   const signature = await toolboxWallet.quickSign(request.networkId, request.payload);
//   return {
//     status: 'success',
//     signature,
//   };
// }

async function handleWalletRequest(request: WalletRequest) {
  switch (request.method) {
    case 'kda_connect':
      return handleKdaConnect(request);
    case 'kda_requestAccount':
      return handleKdaRequestAccount(request);
    case 'kda_checkStatus':
      return handleKdaCheckStatus(request);
    case 'kda_disconnect':
      return handleKdaDisconnect(request);
    case 'kda_getNetwork':
      return toolboxWallet.getNetwork();
    case 'kda_requestSign':
      return handleKdaSign(request);
    default:
      return Promise.reject(new Error('Invalid method'));
  }
}
export function createEckoWalletMock(): WalletApi {
  return {
    isKadena: true,
    on: (event: string, callback: any) => {
      console.log(event, callback);
    },
    request: async (request: WalletRequest) => {
      return handleWalletRequest(request);
    },
  };
}

export function mockEckoWallet() {
  window.kadena = createEckoWalletMock();
}
