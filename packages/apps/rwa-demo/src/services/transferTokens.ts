import type { IWalletAccount } from '@/components/AccountProvider/AccountType';
import { getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { getPubkeyFromAccount } from '@/utils/getPubKey';
import { Pact } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';

export interface ITransferTokensProps {
  amount: number;
  investorFromAccount: string;
  investorToAccount: string;
}

const createPubKeyFromAccount = (account: string): string => {
  return account.replace('k:', '').replace('r:', '');
};

export const transferTokens = async (
  data: ITransferTokensProps,
  account: IWalletAccount,
) => {
  return Pact.builder
    .execution(
      `
       (${getAsset()}.transfer (read-string 'investorFrom) (read-string 'investorTo) ${new PactNumber(data.amount).toDecimal()})`,
    )
    .addData('investorFrom', data.investorFromAccount)
    .addData('investorTo', data.investorToAccount)
    .setMeta({
      senderAccount: account.address,
      chainId: getNetwork().chainId,
    })
    .addSigner(createPubKeyFromAccount(data.investorFromAccount), (withCap) => [
      withCap(
        `${getAsset()}.TRANSFER`,
        data.investorFromAccount,
        data.investorToAccount,
        {
          decimal: data.amount,
        },
      ),
    ])
    .addSigner(getPubkeyFromAccount(account), (withCap) => [
      withCap(`coin.GAS`),
    ])
    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
