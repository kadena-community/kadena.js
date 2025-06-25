import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import type { IWalletAccount } from '@/providers/AccountProvider/AccountType';
import { getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { getPubkeyFromAccount } from '@/utils/getPubKey';
import { Pact } from '@kadena/client';
import { AGENTROLES } from './addAgent';

export interface IBatchSetAddressFrozenProps {
  investorAccounts: string[];
  pause: boolean;
  message?: string;
}

export const batchSetAddressFrozen = async (
  data: IBatchSetAddressFrozenProps,
  account: IWalletAccount,
  asset: IAsset,
) => {
  return Pact.builder
    .execution(
      `(${getAsset(asset)}.batch-set-address-frozen (read-msg 'investors) (read-msg 'pause))
      `,
    )
    .addData('investors', data.investorAccounts)
    .addData(
      'pause',
      data.investorAccounts.map((_) => data.pause),
    )
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
