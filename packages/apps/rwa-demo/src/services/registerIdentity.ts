import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import type { IWalletAccount } from '@/providers/AccountProvider/AccountType';
import { getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { getPubkeyFromAccount } from '@/utils/getPubKey';
import { Pact } from '@kadena/client';
import { AGENTROLES } from './addAgent';
import { getKeysetService } from './getKeyset';

export interface IRegisterIdentityProps {
  accountName: string;
  agent: IWalletAccount;
  alias: string;
  alreadyExists?: boolean;
}

export const registerIdentity = async (
  data: IRegisterIdentityProps,
  asset: IAsset,
) => {
  const investorKeyset = await getKeysetService(data.accountName);

  return Pact.builder
    .execution(
      `(${getAsset(asset)}.register-identity (read-string 'investor) (read-msg 'investor-keyset) (read-string 'agent) 1)
      `,
    )
    .addData('investor-keyset', investorKeyset)
    .addData('investor', data.accountName)
    .addData('agent', data.agent.address)
    .setMeta({
      senderAccount: data.agent.address,
      chainId: getNetwork().chainId,
    })
    .addSigner(getPubkeyFromAccount(data.agent), (withCap) => [
      withCap(`${getAsset(asset)}.ONLY-AGENT`, AGENTROLES.OWNER),
      withCap(`${getAsset(asset)}.ONLY-AGENT`, AGENTROLES.AGENTADMIN),
      withCap(`coin.GAS`),
    ])

    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
