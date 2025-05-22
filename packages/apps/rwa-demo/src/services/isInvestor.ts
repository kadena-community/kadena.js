import type { IAsset } from '@/components/AssetProvider/AssetProvider';
import type { IWalletAccount } from '@/providers/AccountProvider/AccountType';
import { getClient, getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { Pact } from '@kadena/client';

export interface IIsInvestorProps {
  account: IWalletAccount;
  asset: IAsset;
}

export const isInvestor = async (data: IIsInvestorProps) => {
  const client = getClient();

  const transaction = Pact.builder
    .execution(
      `(${getAsset(data.asset)}.contains-identity (read-string 'investor))`,
    )
    .setMeta({
      senderAccount: data.account.address,
      chainId: getNetwork().chainId,
    })
    .addData('investor', data.account.address)
    .setNetworkId(getNetwork().networkId)
    .createTransaction();

  const { result } = await client.local(transaction, {
    preflight: false,
    signatureVerification: false,
  });

  return result.status === 'success' ? result.data : undefined;
};
