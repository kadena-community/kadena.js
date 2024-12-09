import type { IWalletAccount } from '@/components/AccountProvider/utils';
import { getClient, getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { Pact } from '@kadena/client';

export interface IGetBalanceProps {
  investorAccount: string;
  account: IWalletAccount;
}

export const getFrozenTokens = async (data: IGetBalanceProps) => {
  const client = getClient();

  const transaction = Pact.builder
    .execution(
      `(RWA.${getAsset()}.get-frozen-tokens (read-string 'user-address))`,
    )
    .setMeta({
      senderAccount: data.account.address,
      chainId: getNetwork().chainId,
    })
    .addData('user-address', data.investorAccount)
    .setNetworkId(getNetwork().networkId)
    .createTransaction();

  const { result } = await client.local(transaction, {
    preflight: false,
    signatureVerification: false,
  });

  return result.status === 'success' ? result.data : undefined;
};
