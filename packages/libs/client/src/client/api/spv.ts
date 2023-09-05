import type { SPVResponse } from '@kadena/chainweb-node-client';
import { spv } from '@kadena/chainweb-node-client';
import type { ChainId } from '@kadena/types';

import type { IPollOptions } from '../interfaces/interfaces';
import { retry } from '../utils/retry';

export async function getSpv(
  host: string,
  requestKey: string,
  targetChainId: ChainId,
): Promise<SPVResponse> {
  const proof = await spv({ requestKey, targetChainId }, host);
  if (typeof proof !== 'string') throw new Error('PROOF_IS_NOT_AVAILABLE');
  return proof;
}

export const pollSpv = (
  host: string,
  requestKey: string,
  targetChainId: ChainId,
  pollingOptions?: IPollOptions,
): Promise<SPVResponse> => {
  const task = async (): Promise<SPVResponse> =>
    getSpv(host, requestKey, targetChainId);

  const retrySpv = retry(task);

  return retrySpv(pollingOptions);
};
