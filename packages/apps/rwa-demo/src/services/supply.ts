import type { IWalletAccount } from '@/components/AccountProvider/utils';
import { getClient, getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { Pact } from '@kadena/client';

export interface ISupplyProps {
  account: IWalletAccount;
}

export const supply = async (data: ISupplyProps) => {
  const client = getClient();

  if (!data.account) return;

  const transaction = Pact.builder
    .execution(`(RWA.${getAsset()}.supply)`)
    .setMeta({
      senderAccount: data.account.address,
      chainId: getNetwork().chainId,
    })
    .setNetworkId(getNetwork().networkId)
    .createTransaction();

  const { result } = await client.local(transaction, {
    preflight: false,
    signatureVerification: false,
  });

  return result.status === 'success' ? result.data : undefined;
};
