import { ICommand, IUnsignedCommand } from '@kadena/types';

import { isExecCommand } from '../../interfaces/isExecCommand';
import { ISingleSignFunction } from '../ISignFunction';
import { parseTransactionCommand } from '../utils/parseTransactionCommand';

import { ISigningRequest, TWalletConnectChainId } from './walletConnectTypes';

import Client from '@walletconnect/sign-client';
import { SessionTypes } from '@walletconnect/types';

interface ISigningResponse {
  body: ICommand | IUnsignedCommand;
}

/**
 * Creates the signWithWalletConnect function with interface {@link ISingleSignFunction}
 *
 * @remarks
 * It is preferred to use the {@link createWalletConnectQuicksign} function
 *
 * @public
 */
export function createWalletConnectSign(
  client: Client,
  session: SessionTypes.Struct,
  walletConnectChainId: TWalletConnectChainId,
): ISingleSignFunction {
  const signWithWalletConnect: ISingleSignFunction = async (transaction) => {
    const parsedTransaction = parseTransactionCommand(transaction);
    if (!isExecCommand(parsedTransaction)) {
      throw new Error('`cont` transactions are not supported');
    }

    const signingRequest: ISigningRequest = {
      code: parsedTransaction.payload.exec.code ?? '',
      data: parsedTransaction.payload.exec.data as { [key: string]: unknown },
      caps: parsedTransaction.signers.flatMap((signer) => {
        if (signer.clist === undefined) {
          return [];
        }
        return signer.clist.map(({ name, args }) => {
          const nameArr = name.split('.');

          return {
            role: nameArr[nameArr.length - 1],
            description: `Description for ${name}`,
            cap: {
              name,
              args,
            },
          };
        });
      }),
      nonce: parsedTransaction.nonce,
      chainId: parsedTransaction.meta.chainId,
      gasLimit: parsedTransaction.meta.gasLimit,
      gasPrice: parsedTransaction.meta.gasPrice,
      sender: parsedTransaction.meta.sender,
      ttl: parsedTransaction.meta.ttl,
    };

    const transactionRequest = {
      id: 1,
      jsonrpc: '2.0',
      method: 'kadena_sign_v1',
      params: signingRequest,
    };

    const response = await client.request<ISigningResponse>({
      topic: session.topic,
      chainId: walletConnectChainId,
      request: transactionRequest,
    });

    if (response?.body === undefined) {
      throw new Error('Error signing transaction');
    }

    return response.body;
  };

  return signWithWalletConnect;
}
