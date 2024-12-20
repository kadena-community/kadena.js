import { getClient, getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { Pact } from '@kadena/client';

export interface IGetBalanceProps {
  investorAccount: string;
}

export const getInvestorBalance = async (data: IGetBalanceProps) => {
  const client = getClient();

  const transaction = Pact.builder
    .execution(`(${getAsset()}.get-balance (read-string 'account))`)
    .setMeta({
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
