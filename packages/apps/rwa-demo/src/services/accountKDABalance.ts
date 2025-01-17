import { getClient, getNetwork } from '@/utils/client';
import { Pact } from '@kadena/client';

export interface IAccountKDABalanceProps {
  accountName: string;
}

export const accountKDABalance = async (data: IAccountKDABalanceProps) => {
  const client = getClient();
  const transaction = Pact.builder
    .execution(
      `(let ((details (coin.details "${data.accountName}")))(let ((principal (create-principal (at "guard" details)))){"details":details, "principal":principal}))`,
    )
    .setMeta({
      senderAccount: data.accountName,
      chainId: getNetwork().chainId,
    })
    .addData('account', data.accountName)

    .setNetworkId(getNetwork().networkId)
    .createTransaction();

  const { result } = await client.local(transaction, {
    preflight: false,
    signatureVerification: false,
  });

  return result.status === 'success'
    ? (result.data as any)?.details?.balance
    : 0;
};
