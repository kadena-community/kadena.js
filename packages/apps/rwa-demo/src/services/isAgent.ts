import type { IWalletAccount } from '@/components/AccountProvider/utils';
import type { INetwork } from '@/components/NetworkProvider/NetworkProvider';
import { ADMIN } from '@/constants';
import { getClient } from '@/utils/client';
import { Pact } from '@kadena/client';

export interface IIsAgentProps {
  agent: string;
}

export const isAgent = async (
  data: IIsAgentProps,
  network: INetwork,
  account: IWalletAccount,
) => {
  const client = getClient();

  const transaction = Pact.builder
    .execution(`(RWA.agent-role.is-agent (read-string 'agent))`)
    .setMeta({
      senderAccount: ADMIN.account,
      chainId: network.chainId,
    })
    .addData('agent', data.agent)
    .setNetworkId(network.networkId)
    .createTransaction();

  const { result } = await client.local(transaction, {
    preflight: false,
    signatureVerification: false,
  });

  return result.status === 'success' ? result.data : undefined;
};
