import { getClient, getNetwork } from '@/utils/client';
import { Pact } from '@kadena/client';

export interface IIsAgentProps {
  agent: string;
}

export const isAgent = async (data: IIsAgentProps) => {
  const client = getClient();

  const transaction = Pact.builder
    .execution(`(RWA.agent-role.is-agent (read-string 'agent))`)
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
