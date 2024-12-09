import type { IWalletAccount } from '@/components/AccountProvider/utils';
import { getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { Pact } from '@kadena/client';

export interface IRemoveAgentProps {
  agent: string;
}

export const removeAgent = async (
  data: IRemoveAgentProps,
  account: IWalletAccount,
) => {
  return Pact.builder
    .execution(`(${getAsset()}.remove-agent (read-string 'agent))`)
    .setMeta({
      senderAccount: account.address,
      chainId: getNetwork().chainId,
    })
    .addSigner(account.keyset.guard.keys[0], (withCap) => [
      withCap(`${getAsset()}.ONLY-OWNER`, ''),
      withCap(`coin.GAS`),
    ])
    .addData('agent', data.agent)
    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
