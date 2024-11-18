import type { INetwork } from '@/components/NetworkProvider/NetworkProvider';
import { ADMIN } from '@/constants';
import { Pact } from '@kadena/client';
import type { ConnectedAccount } from '@kadena/spirekey-sdk';

export interface IRemoveAgentProps {
  agent: string;
}

export const removeAgent = async (
  data: IRemoveAgentProps,
  network: INetwork,
  account: ConnectedAccount,
) => {
  return Pact.builder
    .execution(`(RWA.agent-role.remove-agent (read-string 'agent))`)
    .setMeta({
      senderAccount: ADMIN.account,
      chainId: network.chainId,
    })
    .addSigner(ADMIN.publicKey, (withCap) => [
      withCap(`RWA.agent-role.ONLY-OWNER`),
      withCap(`coin.GAS`),
    ])
    .addData('agent', data.agent)
    .setNetworkId(network.networkId)
    .createTransaction();
};
