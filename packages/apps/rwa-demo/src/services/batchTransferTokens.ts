import type { IWalletAccount } from '@/providers/WalletProvider/WalletType';
import { getNetwork } from '@/utils/client';
import { getAggregatedAccounts } from '@/utils/getAggregatedAccounts';
import { getAsset } from '@/utils/getAsset';
import { getPubkeyFromAccount } from '@/utils/getPubKey';
import { Pact } from '@kadena/client';

export interface ITransferToken {
  to: string;
  amount: string;
}

export interface IBatchTransferTokensProps {
  select: ITransferToken[];
}

export const batchTransferTokens = async (
  data: ITransferToken[],
  account: IWalletAccount,
) => {
  /**
   * for the TRANSFER capability:
   * make sure that every account is only in the array 1 time and the amount is aggregated for a single account
   */

  const aggregatedAccounts = getAggregatedAccounts(data);

  return Pact.builder
    .execution(
      `
       (${getAsset()}.batch-transfer (read-string 'from) (read-msg 'to-list) (read-msg 'amounts))`,
    )
    .addData('from', account.address)
    .addData(
      'to-list',
      data.map((r) => r.to),
    )
    .addData(
      'amounts',
      data.map((r) => ({ decimal: r.amount.trim() })),
    )
    .setMeta({
      senderAccount: account.address,
      chainId: getNetwork().chainId,
      gasLimit: 150000,
    })
    .addSigner(getPubkeyFromAccount(account), (withCap) => [
      ...aggregatedAccounts.map((_, idx) =>
        withCap(
          `${getAsset()}.TRANSFER`,
          account.address,
          aggregatedAccounts[idx].to,
          {
            decimal: aggregatedAccounts[idx].amount.trim(),
          },
        ),
      ),
      withCap(`coin.GAS`),
    ])
    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
