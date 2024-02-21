import { pactCommandToSigningRequest } from '../utils/pactCommandToSigningRequest';
import { parseTransactionCommand } from '../utils/parseTransactionCommand';
import { connect, isConnected, isInstalled } from './eckoCommon';
import type { IEckoSignResponse, IEckoSignSingleFunction } from './eckoTypes';

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Window {
    kadena?: {
      isKadena: boolean;
      request<T>(args: unknown): Promise<T>;
    };
  }
}

/**
 * Creates the signWithEckoWallet function with interface {@link ISingleSignFunction}
 *
 * @remarks
 * It is preferred to use the {@link createEckoWalletQuicksign} function
 *
 * @public
 */
export function createSignWithEckoWallet(): IEckoSignSingleFunction {
  const signWithEckoWallet: IEckoSignSingleFunction = async (transaction) => {
    const parsedTransaction = parseTransactionCommand(transaction);
    const signingRequest = pactCommandToSigningRequest(parsedTransaction);

    await connect(parsedTransaction.networkId);

    const response = await window.kadena?.request<IEckoSignResponse>({
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

  signWithEckoWallet.isInstalled = isInstalled;
  signWithEckoWallet.isConnected = isConnected;
  signWithEckoWallet.connect = connect;

  return signWithEckoWallet;
}

/**
 * Creates the signWithEckoWallet function with interface {@link ISingleSignFunction}
 *
 * @remarks
 * It is preferred to use the {@link createQuicksignWithEckoWallet} function
 *
 * @deprecated Use {@link createSignWithEckoWallet} instead
 * @public
 */
export const createEckoWalletSign = createSignWithEckoWallet;
