import type { Signer } from '@prisma/client';
import { getSigners } from '@services/chainweb-node/signer';
import DataLoader from 'dataloader';

// eslint-disable-next-line @typescript-eslint/naming-convention
interface SignersKey {
  requestKey: string;
  blockHash: string;
  chainId: string;
}

export const signersLoader = new DataLoader<SignersKey, Signer[]>(
  async (keys: readonly SignersKey[]) => {
    const results = await Promise.all(
      keys.map(({ requestKey, blockHash, chainId }) => {
        return getSigners(requestKey, blockHash, chainId);
      }),
    );

    return results;
  },
);
