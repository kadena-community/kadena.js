import type { IWalletAccount } from '@/providers/WalletProvider/WalletType';
import { getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { getPubkeyFromAccount } from '@/utils/getPubKey';
import { Pact } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';

export interface ITransferTokensProps {
  amount: number;
  investorFromAccount?: string;
  investorToAccount: string;
  isForced?: boolean;
}

export const transferTokens = async (
  data: ITransferTokensProps,
  account: IWalletAccount,
) => {
  return Pact.builder
    .execution(
      `
       (${getAsset()}.transfer (read-string 'investorFrom) (read-string 'investorTo) ${new PactNumber(data.amount).toDecimal()})`,
    )
    .addData('investorFrom', account.address)
    .addData('investorTo', data.investorToAccount)
    .setMeta({
      senderAccount: account.address,
      chainId: getNetwork().chainId,
    })
    .addSigner(getPubkeyFromAccount(account), (withCap) => [
      withCap(
        `${getAsset()}.TRANSFER`,
        account.address,
        data.investorToAccount,
        {
          decimal: data.amount,
        },
      ),
      withCap(`coin.GAS`),
    ])
    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
