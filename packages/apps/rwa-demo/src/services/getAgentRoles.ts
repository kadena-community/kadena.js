import type { IWalletAccount } from '@/components/AccountProvider/utils';
import { getClient, getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { Pact } from '@kadena/client';

export interface IGetAgentRolesProps {
  agent: string;
}

export const getAgentRoles = async (
  data: IGetAgentRolesProps,
  account: IWalletAccount,
): Promise<string[]> => {
  const client = getClient();

  const transaction = Pact.builder
    .execution(`(RWA.${getAsset()}.get-agent-roles (read-string 'agent))`)
    .setMeta({
      senderAccount: account.address,
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
