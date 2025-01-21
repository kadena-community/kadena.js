import type { IWalletAccount } from '@/components/AccountProvider/AccountType';
import { getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { getPubkeyFromAccount } from '@/utils/getPubKey';
import { Pact } from '@kadena/client';

export const AGENTROLES = {
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

const createPubKeyFromAccount = (account: string): string => {
  return account.replace('k:', '').replace('r:', '');
};

export const addAgent = async (
  data: IAddAgentProps,
  account: IWalletAccount,
) => {
  return Pact.builder
    .execution(
      `(${getAsset()}.add-agent (read-string 'agent) (read-keyset 'agent_guard))`,
    )
    .setMeta({
      senderAccount: account.address,
      chainId: getNetwork().chainId,
    })
    .addSigner(getPubkeyFromAccount(account), (withCap) => [
      withCap(`${getAsset()}.ONLY-OWNER`, ''),
      withCap(`coin.GAS`, ''),
    ])
    .addData('agent', data.accountName)
    .addData('agent_guard', {
      keys: [createPubKeyFromAccount(data.accountName)],
      pred: 'keys-all',
    })
    .addData('roles', data.roles)

    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
