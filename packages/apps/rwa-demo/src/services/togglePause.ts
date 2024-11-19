import type { IWalletAccount } from '@/components/AccountProvider/utils';
import { ADMIN } from '@/constants';
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
      .execution(`(RWA.mvp-token.pause  (read-string 'agent))`)
      .setMeta({
        senderAccount: ADMIN.account,
        chainId: getNetwork().chainId,
      })
      .addSigner(ADMIN.publicKey, (withCap) => [withCap(`coin.GAS`)])
      .addData('agent', ADMIN.account)
      .setNetworkId(getNetwork().networkId)
      .createTransaction();
  } else {
    return Pact.builder
      .execution(`(RWA.mvp-token.unpause  (read-string 'agent))`)
      .setMeta({
        senderAccount: ADMIN.account,
        chainId: getNetwork().chainId,
      })
      .addSigner(ADMIN.publicKey, (withCap) => [withCap(`coin.GAS`)])
      .addData('agent', ADMIN.account)
      .setNetworkId(getNetwork().networkId)
      .createTransaction();
  }
};
