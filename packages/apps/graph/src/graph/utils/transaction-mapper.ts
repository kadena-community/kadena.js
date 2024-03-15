import { Signer, Transaction } from '@prisma/client';
import { IContext } from '../builder';
import { Transaction1 } from '../types/graphql-types';

export function prismaTransactionMapper(
  prismaTransaction: Transaction,
  prismaSigners: Signer[],
  context: IContext,
): Transaction1 {
  const signersList = prismaSigners.map((signer) => {
    return {
      publicKey: signer.publicKey,
      address: signer.address,
      scheme: signer.scheme,
      clist: (signer.capabilities as Array<{ args: any[]; name: string }>).map(
        (capability) => {
          return {
            name: capability.name,
            args: JSON.stringify(capability.args),
          };
        },
      ),
    };
  });

  return {
    hash: prismaTransaction.requestKey,
    cmd: {
      meta: {
        chainId: prismaTransaction.chainId,
        gasLimit: prismaTransaction.gasLimit,
        creationTime: prismaTransaction.creationTime,
        gasPrice: prismaTransaction.gasPrice,
        sender: prismaTransaction.senderAccount,
        ttl: prismaTransaction.ttl,
      },
      networkId: context.networkId,
      nonce: prismaTransaction.nonce,
      payload: {
        code: JSON.stringify(prismaTransaction.code),
        data: prismaTransaction.data
          ? JSON.stringify(prismaTransaction.data)
          : '',
        pactId: prismaTransaction.pactId,
        step: Number(prismaTransaction.step),
        rollback: prismaTransaction.rollback,
        proof: prismaTransaction.proof,
      },
      signers: signersList,
    },
    result: {
      badResult: prismaTransaction.badResult
        ? JSON.stringify(prismaTransaction.badResult)
        : null,
      continuation: prismaTransaction.continuation
        ? JSON.stringify(prismaTransaction.continuation)
        : null,
      gas: prismaTransaction.gas,
      goodResult: prismaTransaction.goodResult
        ? JSON.stringify(prismaTransaction.goodResult)
        : null,
      height: prismaTransaction.height,
      logs: prismaTransaction.logs,
      metadata: prismaTransaction.metadata
        ? JSON.stringify(prismaTransaction.metadata)
        : null,
      eventCount: prismaTransaction.eventCount,
      transactionId: prismaTransaction.transactionId,
    },
  };
}

export function mempoolTxMapper(mempoolData: any): Transaction1 {
  let mempoolInfo = {
    status: mempoolData.tag,
  };
  let mempoolTx = JSON.parse(mempoolData.contents);

  mempoolTx.cmd = JSON.parse(mempoolTx.cmd);

  if ('cont' in mempoolTx.cmd.payload) {
    mempoolTx.cmd.payload = mempoolTx.cmd.payload.cont;
  } else if ('exec' in mempoolTx.cmd.payload) {
    mempoolTx.cmd.payload = mempoolTx.cmd.payload.exec;
  }

  mempoolTx.cmd.payload.data = JSON.stringify(mempoolTx.cmd.payload.data);

  return {
    hash: mempoolTx.hash,
    cmd: mempoolTx.cmd,
    result: mempoolInfo,
  };
}
