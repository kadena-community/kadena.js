import type { IWalletAccount } from '@/components/AccountProvider/utils';
import type { INetwork } from '@/components/NetworkProvider/NetworkProvider';
import { Pact } from '@kadena/client';

export interface IRegisterIdentityProps {
  investor: string;
  agent: IWalletAccount;
}

export const registerIdentity = async (
  data: IRegisterIdentityProps,
  network: INetwork,
) => {
  return Pact.builder
    .execution(
      `(RWA.identity-registry.register-identity (read-string 'investor) "" 1 (read-string 'agent))`,
    )
    .setMeta({
      senderAccount: data.agent.address,
      chainId: network.chainId,
    })
    .addSigner(data.agent.keyset.guard.keys[0], (withCap) => [
      withCap(`RWA.agent-role.ONLY-AGENT`, data.agent.address),
      withCap(`coin.GAS`),
    ])
    .addData('investor', data.investor)
    .addData('agent', data.agent.address)

    .setNetworkId(network.networkId)
    .createTransaction();
};
