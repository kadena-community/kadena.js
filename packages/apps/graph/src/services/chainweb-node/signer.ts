import { prismaClient } from '@db/prisma-client';
import type { Signer } from '@prisma/client';
import { nullishOrEmpty } from '@utils/nullish-or-empty';
import { getMempoolTransactionSigners } from './mempool';

export async function getSigners(
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
