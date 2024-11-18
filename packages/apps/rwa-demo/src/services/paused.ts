import type { IWalletAccount } from '@/components/AccountProvider/utils';
import type { INetwork } from '@/components/NetworkProvider/NetworkProvider';
import { ADMIN } from '@/constants';
import { getClient } from '@/utils/client';
import { Pact } from '@kadena/client';

export interface IIsAgentProps {
  agent: string;
}

export const paused = async (network: INetwork) => {
  const client = getClient();

  const transaction = Pact.builder
    .execution(`(RWA.mvp-token.paused)`)
    .setMeta({
      senderAccount: ADMIN.account,
      chainId: network.chainId,
    })
    .setNetworkId(network.networkId)
    .createTransaction();

  const { result } = await client.local(transaction, {
    preflight: false,
    signatureVerification: false,
  });

  return result.status === 'success' ? result.data : undefined;
};
