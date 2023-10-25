import type { ChainId } from '@kadena/types';
import { Pact } from '../../../pact';
import { NetworkId } from '../../support/enums';
import { dirtyRead } from '../client';

export async function getBalance(
  account: string,
  chainId: ChainId,
): Promise<number> {
  const tr = Pact.builder
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .execution((Pact.modules as any).coin['get-balance'](account))
    .setMeta({ chainId: chainId })
    .setNetworkId(NetworkId.fast_development)
    .createTransaction();

  const response = await dirtyRead(tr);
  if (response.result.status === 'failure') {
    console.error(response);
    throw new Error('Unable to retrieve balance');
  }
  return response.result.data as number;
}
