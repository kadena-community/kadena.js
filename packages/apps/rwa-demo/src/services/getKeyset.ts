import type { Guard } from '@/__generated__/sdk';
import { getClient, getNetwork } from '@/utils/client';
import { Pact } from '@kadena/client';

export const getKeysetService = async (
  account: string,
): Promise<Record<string, any>> => {
  const client = getClient();
  const transaction = Pact.builder
    .execution(`(at 'guard (coin.details "${account}"))`)
    .setMeta({
      chainId: getNetwork().chainId,
    })
    .setNetworkId(getNetwork().networkId)
    .createTransaction();

  const { result } = await client.local(transaction, {
    preflight: false,
    signatureVerification: false,
  });

  return result.status === 'success'
    ? (result.data as Guard)
    : {
        pred: 'keys-all',
        keys: [account.substring(2)],
      };
};
