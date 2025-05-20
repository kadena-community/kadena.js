import type { IWalletAccount } from '@/providers/WalletProvider/WalletType';
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
) => {
  const func = data.isPaused ? 'unpause' : 'pause';

  return Pact.builder
    .execution(`(${getAsset()}.${func})`)
    .setMeta({
      senderAccount: account.address,
      chainId: getNetwork().chainId,
    })
    .addData('agent', account.address)
    .addSigner(getPubkeyFromAccount(account), (withCap) => [
      withCap(`${getAsset()}.ONLY-AGENT`, AGENTROLES.FREEZER),
      withCap(`coin.GAS`),
    ])
    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
