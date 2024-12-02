import type { IWalletAccount } from '@/components/AccountProvider/utils';
import { getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { Pact } from '@kadena/client';

export interface IAddAgentProps {
  accountName: string;
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
      `(RWA.${getAsset()}.add-agent (read-string 'agent) (read-keyset 'agent_guard))`,
    )
    .setMeta({
      senderAccount: account.address,
      chainId: getNetwork().chainId,
    })
    .addSigner(account.keyset.guard.keys[0], (withCap) => [
      withCap(`RWA.${getAsset()}.ONLY-OWNER`, ''),
      withCap(`coin.GAS`),
    ])
    .addData('agent', data.accountName)
    .addData('agent_guard', {
      keys: [createPubKeyFromAccount(data.accountName)],
      pred: 'keys-all',
    })
    .addData('roles', [
      'agent-admin',
      'supply-modifier',
      'freezer',
      'transfer-manager',
      'recovery',
      'compliance',
      'whitelist-manager',
    ])

    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
