import type { IWalletAccount } from '@/components/AccountProvider/AccountType';
import { getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { getPubkeyFromAccount } from '@/utils/getPubKey';
import { Pact } from '@kadena/client';
import { AGENTROLES } from './addAgent';

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
    .addSigner(getPubkeyFromAccount(account), (withCap) => [
      withCap(`${getAsset()}.ONLY-AGENT`, AGENTROLES.OWNER),
      withCap(`coin.GAS`),
    ])
    .addData('agent', data.agent)
    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
