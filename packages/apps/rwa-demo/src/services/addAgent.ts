import type { IAsset } from '@/components/AssetProvider/AssetProvider';
import type { IWalletAccount } from '@/providers/AccountProvider/AccountType';
import { getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { getKeyset, getPubkeyFromAccount } from '@/utils/getPubKey';
import { Pact } from '@kadena/client';

export const AGENTROLES = {
  OWNER: 'owner',
  AGENTADMIN: 'agent-admin',
  FREEZER: 'freezer',
  TRANSFERMANAGER: 'transfer-manager',
} as const;

export interface IAddAgentProps {
  accountName: string;
  agent: IWalletAccount;
  alias: string;
  alreadyExists?: boolean;
  roles: string[];
}

export const addAgent = async (
  data: IAddAgentProps,
  account: IWalletAccount,
  asset: IAsset,
) => {
  return Pact.builder
    .execution(
      `(${getAsset(asset)}.add-agent (read-string 'agent) (read-keyset 'agent_guard))`,
    )
    .setMeta({
      senderAccount: account.address,
      chainId: getNetwork().chainId,
    })
    .addSigner(getPubkeyFromAccount(account), (withCap) => [
      withCap(`${getAsset(asset)}.ONLY-AGENT`, AGENTROLES.OWNER),
      withCap(`coin.GAS`),
    ])
    .addData('agent', data.accountName)
    .addData('agent_guard', getKeyset(account))
    .addData('roles', data.roles)

    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
