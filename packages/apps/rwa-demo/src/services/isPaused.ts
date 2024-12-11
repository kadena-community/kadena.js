import type { IWalletAccount } from '@/components/AccountProvider/AccountType';
import { getClient, getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { Pact } from '@kadena/client';

export interface IIsPausedProps {
  account: IWalletAccount;
}

export const isPaused = async (data: IIsPausedProps) => {
  const client = getClient();

  const transaction = Pact.builder
    .execution(`(${getAsset()}.paused)`)
    .setMeta({
      senderAccount: data.account.address,
      chainId: getNetwork().chainId,
    })
    .addData('agent', data.account.address)
    .setNetworkId(getNetwork().networkId)
    .createTransaction();

  const { result } = await client.local(transaction, {
    preflight: false,
    signatureVerification: false,
  });

  return result.status === 'success' ? result.data : undefined;
};
