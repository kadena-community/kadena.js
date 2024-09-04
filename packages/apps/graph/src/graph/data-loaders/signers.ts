import { prismaClient } from '@db/prisma-client';
import type { Signer } from '@prisma/client';
import { getMempoolTransactionSigners } from '@services/chainweb-node/mempool';
import { nullishOrEmpty } from '@utils/nullish-or-empty';
import DataLoader from 'dataloader';

interface ISignersKey {
  requestKey: string;
  blockHash: string;
  chainId: string;
}

export const signersLoader = new DataLoader<ISignersKey, Signer[]>(
  async (keys: readonly ISignersKey[]) => {
    const mempoolKeys = keys.filter(({ blockHash }) =>
      nullishOrEmpty(blockHash),
    );
    const transactionKeys = keys.filter(
      ({ blockHash }) => !nullishOrEmpty(blockHash),
    );

    const mempoolPromises = mempoolKeys.map(({ requestKey, chainId }) => {
      return getMempoolTransactionSigners(requestKey, chainId);
    });

    const transactionsPromise = prismaClient.signer.findMany({
      where: {
        requestKey: {
          in: transactionKeys.map(({ requestKey }) => requestKey),
        },
      },
    });

    await Promise.all([...mempoolPromises, transactionsPromise]);

    const mempoolResults = await Promise.all(mempoolPromises);
    const transactionResults = await transactionsPromise;

    const txSignersByRequestkey = transactionResults.reduce(
      (acc, result) => {
        acc[result.requestKey] = [...(acc[result.requestKey] || []), result];
        return acc;
      },
      {} as Record<string, Signer[]>,
    );

    const mempoolSignersByRequestkey = mempoolResults.reduce(
      (acc, result) => {
        acc[result[0].requestKey] = result;
        return acc;
      },
      {} as Record<string, Signer[]>,
    );

    return keys.map(({ requestKey, blockHash }) => {
      if (nullishOrEmpty(blockHash)) {
        return mempoolSignersByRequestkey[requestKey] || [];
      } else {
        return txSignersByRequestkey[requestKey] || [];
      }
    });
  },
);

async function getSigners(
  requestKey: string,
  blockHash: string,
  chainId: string,
): Promise<Signer[]> {
  // This is needed because if the transaction is in the mempool, the
  // signers are not stored in the database and there is no status.
  // If blockHash has a value, we do not check the mempool for signers or status
  if (nullishOrEmpty(blockHash)) {
    return await getMempoolTransactionSigners(requestKey, chainId.toString());
  } else {
    return await prismaClient.signer.findMany({
      where: {
        requestKey: requestKey,
      },
    });
  }
}
