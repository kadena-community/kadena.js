import type { IWalletAccount } from '@/components/AccountProvider/utils';
import { ADMIN } from '@/constants';
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
    .execution(`(RWA.${getAsset()}.remove-agent (read-string 'agent))`)
    .setMeta({
      senderAccount: ADMIN.account,
      chainId: getNetwork().chainId,
    })
    .addSigner(ADMIN.publicKey, (withCap) => [
      withCap(`RWA.${getAsset()}.ONLY-OWNER`),
      withCap(`coin.GAS`),
    ])
    .addData('agent', data.agent)
    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
