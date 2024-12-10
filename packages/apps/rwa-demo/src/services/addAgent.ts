import type { IWalletAccount } from '@/components/AccountProvider/utils';
import { getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { Pact } from '@kadena/client';

export const AGENTROLES = {
  AGENTADMIN: 'agent-admin',
  SUPPLYMODIFIER: 'supply-modifier',
  FREEZER: 'freezer',
  TRANSFERMANAGER: 'transfer-manager',
  RECOVERY: 'recovery',
  COMPLIANCE: 'compliance',
  WHITELISTMANAGER: 'whitelist-manager',
} as const;

export interface IAddAgentProps {
  accountName: string;
  agent: IWalletAccount;
  alias: string;
  alreadyExists?: boolean;
  roles: (keyof typeof AGENTROLES)[];
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
    .addSigner(account.keyset.guard.keys[0], (withCap) => [
      withCap(`${getAsset()}.ONLY-OWNER`, ''),
      withCap(`coin.GAS`, ''),
    ])
    .addData('agent', data.accountName)
    .addData('agent_guard', {
      keys: [createPubKeyFromAccount(data.accountName)],
      pred: 'keys-all',
    })
    .addData(
      'roles',
      data.roles.map((val) => AGENTROLES[val]),
    )

    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
