import type { IWalletAccount } from '@/components/AccountProvider/AccountType';
import { getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { getPubkeyFromAccount } from '@/utils/getPubKey';
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
    .addSigner(getPubkeyFromAccount(account), (withCap) => [
      withCap(`${getAsset()}.ONLY-AGENT`, 'freezer'),
      withCap(`coin.GAS`),
    ])
    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
