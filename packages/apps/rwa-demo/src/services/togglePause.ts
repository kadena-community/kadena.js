import type { IWalletAccount } from '@/components/AccountProvider/utils';
import { getNetwork } from '@/utils/client';
import { Pact } from '@kadena/client';

export interface IRemoveAgentProps {
  agent: string;
}

export const togglePause = async (
  isPaused: boolean,
  account: IWalletAccount,
) => {
  const func = isPaused ? 'unpause' : 'pause';

  return Pact.builder
    .execution(`(RWA.mvp-token.${func})`)
    .setMeta({
      senderAccount: account.address,
      chainId: getNetwork().chainId,
    })
    .addData('agent', account.address)
    .addSigner(account.keyset.guard.keys[0], (withCap) => [
      withCap(`RWA.mvp-token.ONLY-AGENT`, 'freezer'),
      withCap(`coin.GAS`),
    ])
    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
