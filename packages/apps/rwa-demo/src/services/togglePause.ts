import type { IWalletAccount } from '@/components/AccountProvider/utils';
import type { INetwork } from '@/components/NetworkProvider/NetworkProvider';
import { ADMIN } from '@/constants';
import { Pact } from '@kadena/client';

export interface IRemoveAgentProps {
  agent: string;
}

export const togglePause = async (
  isPaused: boolean,
  network: INetwork,
  account: IWalletAccount,
) => {
  if (isPaused) {
    return Pact.builder
      .execution(`(RWA.mvp-token.pause  (read-string 'agent))`)
      .setMeta({
        senderAccount: ADMIN.account,
        chainId: network.chainId,
      })
      .addSigner(ADMIN.publicKey, (withCap) => [withCap(`coin.GAS`)])
      .addData('agent', ADMIN.account)
      .setNetworkId(network.networkId)
      .createTransaction();
  } else {
    return Pact.builder
      .execution(`(RWA.mvp-token.unpause  (read-string 'agent))`)
      .setMeta({
        senderAccount: ADMIN.account,
        chainId: network.chainId,
      })
      .addSigner(ADMIN.publicKey, (withCap) => [withCap(`coin.GAS`)])
      .addData('agent', ADMIN.account)
      .setNetworkId(network.networkId)
      .createTransaction();
  }
};
