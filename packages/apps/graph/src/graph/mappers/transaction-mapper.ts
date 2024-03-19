import { prismaClient } from '@db/prisma-client';
import type { Signer, Transaction } from '@prisma/client';
import type { IContext } from '../builder';
import type { Transaction as GQLTransaction } from '../types/graphql-types';
import { prismaSignersMapper } from './signer-mapper';

export async function prismaTransactionsMapper(
  prismaTransactions: Transaction[],
  context: IContext,
): Promise<GQLTransaction[]> {
  const requestKeys = [...new Set(prismaTransactions.map((t) => t.requestKey))];

  const prismaSigners = await prismaClient.signer.findMany({
    where: { requestKey: { in: requestKeys } },
  });

  return Promise.all(
    prismaTransactions.map(async (prismaTransaction) => {
      const transactionSigners = prismaSigners.filter(
        (s) => s.requestKey === prismaTransaction.requestKey,
      );
      return await prismaTransactionMapper(
        prismaTransaction,
        context,
        transactionSigners,
      );
    }),
  );
}

export async function prismaTransactionMapper(
  prismaTransaction: Transaction,
  context: IContext,
  prismaSigners?: Signer[],
): Promise<GQLTransaction> {
  if (!prismaSigners) {
    prismaSigners = await prismaClient.signer.findMany({
      where: { requestKey: prismaTransaction.requestKey },
    });
  }

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
      signers: prismaSignersMapper(prismaSigners),
    },
    result: {
      badResult: prismaTransaction.badResult
        ? JSON.stringify(prismaTransaction.badResult)
        : null,
      blockHash: prismaTransaction.blockHash,
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

export function mempoolTxMapper(mempoolData: any): GQLTransaction {
  const mempoolInfo = {
    status: mempoolData.tag,
  };
  const mempoolTx = JSON.parse(mempoolData.contents);

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
