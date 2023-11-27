import { Pact } from '@kadena/client';
import type { ChainId, PactValue } from '@kadena/types';
import { devnetConfig } from './config';
import { dirtyRead, logger } from './helper';

export async function getBalance({
  account,
  chainId = devnetConfig.CHAIN_ID,
}: {
  account: string;
  chainId?: ChainId;
}): Promise<PactValue> {
  logger.info(`Getting balance for ${account} on chain ${chainId}`);
  const transaction = Pact.builder
    .execution(Pact.modules.coin['get-balance'](account))
    .setMeta({
      chainId: chainId,
    })
    .setNetworkId(devnetConfig.NETWORK_ID)
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
