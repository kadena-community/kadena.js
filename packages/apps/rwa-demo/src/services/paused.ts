import { ADMIN } from '@/constants';
import { getClient, getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { Pact } from '@kadena/client';

export interface IIsAgentProps {
  agent: string;
}

export const paused = async () => {
  const client = getClient();

  const transaction = Pact.builder
    .execution(`(${getAsset()}.paused)`)
    .setMeta({
      senderAccount: ADMIN.account,
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
