import type { IWalletAccount } from '@/components/AccountProvider/utils';
import { getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { getPubkeyFromAccount } from '@/utils/getPubKey';
import { Pact } from '@kadena/client';

export interface IDeleteIdentityProps {
  investor: string;
}

export const deleteIdentity = async (
  data: IDeleteIdentityProps,
  account: IWalletAccount,
) => {
  return Pact.builder
    .execution(`(${getAsset()}.delete-identity (read-string 'investor))`)
    .setMeta({
      senderAccount: account.address,
      chainId: getNetwork().chainId,
    })
    .addSigner(getPubkeyFromAccount(account), (withCap) => [
      withCap(`${getAsset()}.ONLY-AGENT`, 'whitelist-manager'),
      withCap(`coin.GAS`),
    ])
    .addData('investor', data.investor)
    .addData('agent', account.address)
    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
