import { pactCommandToSigningRequest } from '../utils/pactCommandToSigningRequest';
import { parseTransactionCommand } from '../utils/parseTransactionCommand';
import { connect, isConnected, isInstalled } from './koalaCommon';
import type {
  IKoalaSignResponse,
  IKoalaSignSingleFunction,
} from './koalaTypes';

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Window {
    koala?: {
      isKadena: boolean;
      isKoala: boolean;
      request<T>(args: unknown): Promise<T>;
    };
  }
}

/**
 * Creates the signWithKoalaWallet function with interface {@link ISingleSignFunction}
 *
 * @remarks
 * It is preferred to use the {@link createKoalaWalletQuicksign} function
 *
 * @public
 */
export function createKoalaWalletSign(): IKoalaSignSingleFunction {
  const signWithKoalaWallet: IKoalaSignSingleFunction = async (transaction) => {
    const parsedTransaction = parseTransactionCommand(transaction);
    const signingRequest = pactCommandToSigningRequest(parsedTransaction);

    await connect(parsedTransaction.networkId);

    const response = await window.koala?.request<IKoalaSignResponse>({
      method: 'kda_requestSign',
      data: {
        networkId: parsedTransaction.networkId,
        signingCmd: signingRequest,
      },
    });

    if (response?.signedCmd === undefined) {
      throw new Error('Error signing transaction');
    }

    return response.signedCmd;
  };

  signWithKoalaWallet.isInstalled = isInstalled;
  signWithKoalaWallet.isConnected = isConnected;
  signWithKoalaWallet.connect = connect;

  return signWithKoalaWallet;
}
