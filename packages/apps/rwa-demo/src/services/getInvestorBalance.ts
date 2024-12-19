import type { IWalletAccount } from '@/components/AccountProvider/AccountType';
import { getClient, getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { Pact } from '@kadena/client';

export interface IGetBalanceProps {
  investorAccount: string;
  account: IWalletAccount;
}

export const getInvestorBalance = async (data: IGetBalanceProps) => {
  const client = getClient();

  const transaction = Pact.builder
    .execution(`(${getAsset()}.get-balance (read-string 'account))`)
    .setMeta({
      senderAccount: data.account.address,
      chainId: getNetwork().chainId,
    })
    .addData('account', data.investorAccount)
    .setNetworkId(getNetwork().networkId)
    .createTransaction();

  const { result } = await client.local(transaction, {
    preflight: false,
    signatureVerification: false,
  });

  return result.status === 'success' ? result.data : undefined;
};
