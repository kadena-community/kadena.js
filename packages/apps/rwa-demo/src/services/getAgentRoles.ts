import type { IAsset } from '@/components/AssetProvider/AssetProvider';
import { getClient, getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { Pact } from '@kadena/client';

export interface IGetAgentRolesProps {
  agent: string;
}

export const getAgentRoles = async (
  data: IGetAgentRolesProps,
  asset: IAsset,
): Promise<string[]> => {
  const client = getClient();

  const transaction = Pact.builder
    .execution(`(${getAsset(asset)}.get-agent-roles (read-string 'agent))`)
    .setMeta({
      chainId: getNetwork().chainId,
    })
    .addData('agent', data.agent)
    .setNetworkId(getNetwork().networkId)
    .createTransaction();

  const { result } = await client.local(transaction, {
    preflight: false,
    signatureVerification: false,
  });

  return result.status === 'success'
    ? (result.data as string[])
    : ([] as string[]);
};
