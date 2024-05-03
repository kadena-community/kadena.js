import type { Signer } from '@prisma/client';
import { getSigners } from '@services/chainweb-node/signer';
import DataLoader from 'dataloader';

interface ISignersKey {
  requestKey: string;
  blockHash: string;
  chainId: string;
}

export const signersLoader = new DataLoader<ISignersKey, Signer[]>(
  async (keys: readonly ISignersKey[]) => {
    const results = await Promise.all(
      keys.map(({ requestKey, blockHash, chainId }) => {
        return getSigners(requestKey, blockHash, chainId);
      }),
    );

    return results;
  },
);
