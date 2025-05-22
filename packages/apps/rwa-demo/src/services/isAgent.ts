import type { IAsset } from '@/components/AssetProvider/AssetProvider';
import { getClient, getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { Pact } from '@kadena/client';

export interface IIsAgentProps {
  agent: string;
  asset: IAsset;
}

export const isAgent = async (data: IIsAgentProps) => {
  const client = getClient();

  const transaction = Pact.builder
    .execution(`(${getAsset(data.asset)}.is-agent (read-string 'agent))`)
    .setMeta({
      senderAccount: data.agent,
      chainId: getNetwork().chainId,
    })
    .addData('agent', data.agent)
    .setNetworkId(getNetwork().networkId)
    .createTransaction();

  const { result } = await client.local(transaction, {
    preflight: false,
    signatureVerification: false,
  });

  return result.status === 'success' ? result.data : undefined;
};
