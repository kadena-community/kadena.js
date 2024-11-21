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
  if (isPaused) {
    return Pact.builder
      .execution(`(RWA.mvp-token.unpause)`)
      .setMeta({
        senderAccount: account.address,
        chainId: getNetwork().chainId,
      })
      .addSigner(account.keyset.guard.keys[0], (withCap) => [
        withCap(`coin.GAS`),
      ])
      .addData('agent', account.address)
      .setNetworkId(getNetwork().networkId)
      .createTransaction();
  } else {
    return Pact.builder
      .execution(`(RWA.mvp-token.pause)`)
      .setMeta({
        senderAccount: account.address,
        chainId: getNetwork().chainId,
      })
      .addSigner(account.keyset.guard.keys[0], (withCap) => [
        withCap(`RWA.mvp-token.ONLY-AGENT`, 'FREEZER'),
        withCap(`coin.GAS`),
      ])
      .setNetworkId(getNetwork().networkId)
      .createTransaction();
  }
};
