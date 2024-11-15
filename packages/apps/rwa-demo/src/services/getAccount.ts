import type { INetwork } from '@/components/NetworkProvider/NetworkProvider';
import { getClient } from '@/utils/client';
import { Pact } from '@kadena/client';

export const getAccount = async (accountId: string, network: INetwork) => {
  const client = getClient();

  const transaction = Pact.builder
    .execution(`(coin.details "${accountId}")`)
    .setMeta({
      chainId: network.chainId,
    })
    .setNetworkId(network.networkId)
    .createTransaction();

  const { result } = await client.local(transaction, {
    preflight: false,
    signatureVerification: false,
  });

  return result.status === 'success' ? result.data : undefined;
};
