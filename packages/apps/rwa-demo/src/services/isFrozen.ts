import type { IWalletAccount } from '@/components/AccountProvider/utils';
import { getClient, getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { Pact } from '@kadena/client';

export interface IIsFrozenProps {
  investorAccount: string;
  account: IWalletAccount;
}

export const isFrozen = async (data: IIsFrozenProps) => {
  const client = getClient();

  const transaction = Pact.builder
    .execution(`(RWA.${getAsset()}.is-frozen (read-string 'investor))`)
    .setMeta({
      senderAccount: data.account.address,
      chainId: getNetwork().chainId,
    })
    .addData('investor', data.investorAccount)
    .setNetworkId(getNetwork().networkId)
    .createTransaction();

  const { result } = await client.local(transaction, {
    preflight: false,
    signatureVerification: false,
  });

  return result.status === 'success' ? result.data : undefined;
};
