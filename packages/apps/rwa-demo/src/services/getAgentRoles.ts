import { IAsset } from '@/components/AssetProvider/AssetProvider';
import { getClient, getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { Pact } from '@kadena/client';

export interface IGetAgentRolesProps {
  agent: string;
  asset?: IAsset;
}

export const getAgentRoles = async (
  data: IGetAgentRolesProps,
): Promise<string[]> => {
  if (!data.asset) return [];
  const client = getClient();

  const transaction = Pact.builder
    .execution(
      `(n_3bf5f49fbd1417467a1cfaa246d70f1be3a65aa1.iiiiii.get-agent-roles (read-string 'agent))`,
    )
    .setMeta({
      chainId: getNetwork().chainId,
    })
    .addData(
      'agent',
      'bb7882b14932d7a2e035ffa3c4d0a85175f27013c26bcb05d241ac1efbea2791',
    )
    .setNetworkId(getNetwork().networkId)
    .createTransaction();

  const { result } = await client.local(transaction, {
    preflight: false,
    signatureVerification: false,
  });
  console.log(transaction, result, getNetwork());

  return result.status === 'success'
    ? (result.data as string[])
    : ([] as string[]);
};
