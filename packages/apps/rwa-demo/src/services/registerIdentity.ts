import type { IWalletAccount } from '@/components/AccountProvider/utils';
import { getNetwork } from '@/utils/client';
import { Pact } from '@kadena/client';

export interface IRegisterIdentityProps {
  investor: string;
  agent: IWalletAccount;
}

export const registerIdentity = async (data: IRegisterIdentityProps) => {
  return Pact.builder
    .execution(
      `(RWA.identity-registry.register-identity (read-string 'investor) "" 1 (read-string 'agent))`,
    )
    .setMeta({
      senderAccount: data.agent.address,
      chainId: getNetwork().chainId,
    })
    .addSigner(data.agent.keyset.guard.keys[0], (withCap) => [
      withCap(`RWA.agent-role.ONLY-AGENT`, data.agent.address),
      withCap(`coin.GAS`),
    ])
    .addData('investor', data.investor)
    .addData('agent', data.agent.address)
    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
