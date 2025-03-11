import { getClient, getNetwork } from '@/utils/client';
import { Pact } from '@kadena/client';

export const getAccount = async (accountId: string) => {
  const client = getClient();

  const transaction = Pact.builder
    .execution(`(coin.details "${accountId}")`)
    .setMeta({
      chainId: getNetwork().chainId,
    })
    .setNetworkId(getNetwork().networkId)
    .createTransaction();

  const { result } = await client.local(transaction, {
    preflight: false,
    signatureVerification: false,
  });

  return result.status === 'success' ? result.data : undefined;
};
