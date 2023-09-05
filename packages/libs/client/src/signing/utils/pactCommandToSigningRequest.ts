import type { IPactCommand } from '../../interfaces/IPactCommand';
import { isExecCommand } from '../../interfaces/isExecCommand';
import type { ISigningRequest } from '../../interfaces/ISigningRequest';

export const pactCommandToSigningRequest = (
  parsedTransaction: IPactCommand,
): ISigningRequest => {
  if (!isExecCommand(parsedTransaction)) {
    throw new Error('`cont` transactions are not supported');
  }

  return {
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
};
