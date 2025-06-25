import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import type { IWalletAccount } from '@/providers/AccountProvider/AccountType';
import { getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { getPubkeyFromAccount } from '@/utils/getPubKey';
import { Pact } from '@kadena/client';
import type { IAddAgentProps } from './addAgent';
import { AGENTROLES } from './addAgent';

export const editAgent = async (
  data: IAddAgentProps,
  account: IWalletAccount,
  asset: IAsset,
) => {
  return Pact.builder
    .execution(
      `(${getAsset(asset)}.update-agent-roles (read-string 'updated-agent) (read-msg 'roles))`,
    )
    .setMeta({
      senderAccount: account.address,
      chainId: getNetwork().chainId,
    })
    .addSigner(getPubkeyFromAccount(account), (withCap) => [
      withCap(`${getAsset(asset)}.ONLY-AGENT`, AGENTROLES.OWNER),
      withCap(`${getAsset(asset)}.ONLY-AGENT`, AGENTROLES.AGENTADMIN),
      withCap(`coin.GAS`),
    ])
    .addData('agent', account.address)
    .addData('updated-agent', data.accountName)
    .addData('roles', data.roles)

    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
