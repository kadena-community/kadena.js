import type { IWalletAccount } from '@/components/AccountProvider/utils';
import { getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { getPubkeyFromAccount } from '@/utils/getPubKey';
import { Pact } from '@kadena/client';
import type { IAddAgentProps } from './addAgent';
import { AGENTROLES } from './addAgent';

export const editAgent = async (
  data: IAddAgentProps,
  account: IWalletAccount,
) => {
  return Pact.builder
    .execution(
      `(RWA.${getAsset()}.update-agent-roles (read-string 'agent) (read-msg 'roles))`,
    )
    .setMeta({
      senderAccount: account.address,
      chainId: getNetwork().chainId,
    })
    .addSigner(getPubkeyFromAccount(account), (withCap) => [
      withCap(`RWA.${getAsset()}.ONLY-AGENT`, 'agent-admin'),
      withCap(`coin.GAS`),
    ])
    .addData('agent', data.accountName)
    .addData(
      'roles',
      data.roles.map((val) => AGENTROLES[val]),
    )

    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
