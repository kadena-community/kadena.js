import type { IWalletAccount } from '@/components/AccountProvider/utils';
import { getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { Pact } from '@kadena/client';

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
    .addSigner(account.keyset.guard.keys[0], (withCap) => [
      withCap(`${getAsset()}.ONLY-AGENT`, 'freezer'),
      withCap(`coin.GAS`),
    ])
    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
