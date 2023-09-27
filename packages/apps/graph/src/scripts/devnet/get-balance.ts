import { Pact } from '@kadena/client';
import type { ChainId, PactValue } from '@kadena/types';

import config from './config';
import { dirtyRead } from './helper';

export async function getBalance({
  account,
  chainId = config.CHAIN_ID,
}: {
  account: string;
  chainId?: ChainId;
}): Promise<PactValue> {
  console.log(`Getting balance for ${account} on chain ${chainId}`);
  const transaction = Pact.builder
    .execution(Pact.modules.coin['get-balance'](account))
    .setMeta({
      chainId: chainId,
    })
    .setNetworkId(config.NETWORK_ID)
    .createTransaction();

  const response = await dirtyRead(transaction);

  if (response.result.status === 'success') {
    return response.result.data;
  } else {
    throw new Error(
      (response.result.error as { message?: string; type?: string })?.message ||
        'Unknown error',
    );
  }
}
