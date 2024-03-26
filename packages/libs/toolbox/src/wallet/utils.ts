import type {
  ChainId,
  IExecutionPayloadObject,
  IPactCommand,
  IUnsignedCommand,
} from '@kadena/client';
import { hash } from '@kadena/cryptography-utils';
import type { WalletSigner } from './provider';
import type { KdaRequestSignRequest } from './providers/eckoWallet/types';

export function signingRequestToPactCommand(
  request: KdaRequestSignRequest,
  signer: WalletSigner,
): IUnsignedCommand {
  const signingCmd = request.data.signingCmd;
  const execPayload: IExecutionPayloadObject = {
    exec: {
      code: signingCmd.code,
      data: signingCmd.data ?? {},
    },
  };

  const signers = signingCmd.caps.map((cap) => ({
    pubKey: signer.publicKey,
    clist: [cap.cap],
  }));

  const cmd: IPactCommand = {
    payload: execPayload,
    meta: {
      chainId: signingCmd.chainId as ChainId,
      sender: signingCmd.sender,
      gasLimit: signingCmd.gasLimit,
      gasPrice: signingCmd.gasPrice,
      ttl: signingCmd.ttl,
      creationTime: Date.now(),
    },
    signers,
    networkId: request.data.networkId,
    nonce: signingCmd.nonce ?? '',
  };
  const cmdStr = JSON.stringify(cmd);
  return {
    cmd: cmdStr,
    hash: hash(cmdStr),
    sigs: [],
  };
}
