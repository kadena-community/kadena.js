import { ICommand } from '@kadena/types';

import { ISignSingleFunction } from './ISignFunction';
import { ISigningRequest, TWalletConnectChainId } from './walletConnectTypes';

import Client from '@walletconnect/sign-client';
import { SessionTypes } from '@walletconnect/types';

interface ISigningResponse {
  body: ICommand;
}

export function createWalletConnectSign(
  client: Client,
  session: SessionTypes.Struct,
  walletConnectChainId: TWalletConnectChainId,
): ISignSingleFunction {
  const signWithWalletConnect: ISignSingleFunction = async (transaction) => {
    transaction.createCommand(); // this will generate the nonce that we pass below

    const signingRequest: ISigningRequest = {
      code: transaction.code,
      data: transaction.data,
      caps: transaction.signers.flatMap((signer) =>
        signer.caps.map(({ name, args }) => {
          const nameArr = name.split('.');

          return {
            role: nameArr[nameArr.length - 1],
            description: `Description for ${name}`,
            cap: {
              name,
              args,
            },
          };
        }),
      ),
      nonce: transaction.nonce,
      chainId: transaction.publicMeta.chainId,
      gasLimit: transaction.publicMeta.gasLimit,
      gasPrice: transaction.publicMeta.gasPrice,
      sender: transaction.publicMeta.sender,
      ttl: transaction.publicMeta.ttl,
    };

    const transactionRequest = {
      id: 1,
      jsonrpc: '2.0',
      method: 'kadena_sign_v1',
      params: signingRequest,
    };

    const response = await client
      .request<ISigningResponse>({
        topic: session.topic,
        chainId: walletConnectChainId,
        request: transactionRequest,
      })
      .catch((e) => console.log('Error signing transaction:', e));

    console.log('Response from client.request:', response);

    if (response?.body === undefined) {
      throw new Error('Error signing transaction');
    }

    const { cmd, sigs } = response.body;

    transaction.addSignatures(
      ...sigs.map((sig, i) => ({
        ...transaction.signers[i],
        sig: sig.sig,
      })),
    );

    transaction.cmd = cmd;

    return response.body;
  };

  return signWithWalletConnect;
}
