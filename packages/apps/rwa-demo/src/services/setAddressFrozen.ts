import type { IAsset } from '@/components/AssetProvider/AssetProvider';
import type { IWalletAccount } from '@/providers/AccountProvider/AccountType';
import { getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { getPubkeyFromAccount } from '@/utils/getPubKey';
import { Pact } from '@kadena/client';
import { AGENTROLES } from './addAgent';

export interface ISetAddressFrozenProps {
  investorAccount: string;
  pause: boolean;
  message?: string;
}

export const setAddressFrozen = async (
  data: ISetAddressFrozenProps,
  account: IWalletAccount,
  asset: IAsset,
) => {
  return Pact.builder
    .execution(
      `(${getAsset(asset)}.set-address-frozen (read-string 'investor) ${data.pause})
      `,
    )
    .addData('investor', data.investorAccount)
    .addData('agent', account.address)
    .setMeta({
      senderAccount: account.address,
      chainId: getNetwork().chainId,
    })
    .addSigner(getPubkeyFromAccount(account), (withCap) => [
      withCap(`${getAsset(asset)}.ONLY-AGENT`, AGENTROLES.FREEZER),
      withCap(`coin.GAS`),
    ])

    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
