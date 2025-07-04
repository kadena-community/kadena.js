import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import type { IWalletAccount } from '@/providers/AccountProvider/AccountType';
import { getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { getPubkeyFromAccount } from '@/utils/getPubKey';
import { Pact } from '@kadena/client';
import { AGENTROLES } from './addAgent';

export interface IDeleteIdentityProps {
  investor: string;
}

export const deleteIdentity = async (
  data: IDeleteIdentityProps,
  account: IWalletAccount,
  asset: IAsset,
) => {
  return Pact.builder
    .execution(`(${getAsset(asset)}.delete-identity (read-string 'investor))`)
    .setMeta({
      senderAccount: account.address,
      chainId: getNetwork().chainId,
    })
    .addSigner(getPubkeyFromAccount(account), (withCap) => [
      withCap(`${getAsset(asset)}.ONLY-AGENT`, AGENTROLES.OWNER),
      withCap(`${getAsset(asset)}.ONLY-AGENT`, AGENTROLES.AGENTADMIN),
      withCap(`coin.GAS`),
    ])
    .addData('investor', data.investor)
    .addData('agent', account.address)
    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
