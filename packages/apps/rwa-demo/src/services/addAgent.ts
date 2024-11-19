import type { IWalletAccount } from '@/components/AccountProvider/utils';
import { getNetwork } from '@/utils/client';
import { Pact } from '@kadena/client';

export interface IAddAgentProps {
  agent: string;
}

const createPubKeyFromAccount = (account: string): string => {
  return account.replace('k:', '').replace('r:', '');
};

export const addAgent = async (
  data: IAddAgentProps,
  account: IWalletAccount,
) => {
  return Pact.builder
    .execution(
      `(RWA.agent-role.add-agent (read-string 'agent) (read-keyset 'agent_guard))`,
    )
    .setMeta({
      senderAccount: account.address,
      chainId: getNetwork().chainId,
    })
    .addSigner(account.keyset.guard.keys[0], (withCap) => [
      withCap(`RWA.agent-role.ONLY-OWNER`),
      withCap(`coin.GAS`),
    ])
    .addData('agent', data.agent)
    .addData('agent_guard', {
      keys: [createPubKeyFromAccount(data.agent)],
      pred: 'keys-all',
    })

    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
