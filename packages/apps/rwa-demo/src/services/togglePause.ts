import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import type { IWalletAccount } from '@/providers/AccountProvider/AccountType';
import { getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { getPubkeyFromAccount } from '@/utils/getPubKey';
import { Pact } from '@kadena/client';
import { AGENTROLES } from './addAgent';

export interface ITogglePauseProps {
  isPaused: boolean;
}

export const togglePause = async (
  data: ITogglePauseProps,
  account: IWalletAccount,
  asset: IAsset,
) => {
  const func = data.isPaused ? 'unpause' : 'pause';

  return Pact.builder
    .execution(`(${getAsset(asset)}.${func})`)
    .setMeta({
      senderAccount: account.address,
      chainId: getNetwork().chainId,
    })
    .addData('agent', account.address)
    .addSigner(getPubkeyFromAccount(account), (withCap) => [
      withCap(`${getAsset(asset)}.ONLY-AGENT`, AGENTROLES.FREEZER),
      withCap(`coin.GAS`),
    ])
    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
