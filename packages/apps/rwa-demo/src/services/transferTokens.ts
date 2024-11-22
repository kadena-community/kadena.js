import type { IWalletAccount } from '@/components/AccountProvider/utils';
import { getNetwork } from '@/utils/client';
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
  console.log(new PactNumber(data.amount).toPrecision(2));
  return Pact.builder
    .execution(
      `
       (RWA.mvp-token.transfer (read-string 'investorFrom) (read-string 'investorTo) ${new PactNumber(data.amount).toDecimal()})`,
    )
    .addData('investorFrom', data.investorFromAccount)
    .addData('investorTo', data.investorToAccount)
    .setMeta({
      senderAccount: account.address,
      chainId: getNetwork().chainId,
    })
    .addSigner(createPubKeyFromAccount(data.investorFromAccount), (withCap) => [
      withCap(
        `RWA.mvp-token.TRANSFER`,
        data.investorFromAccount,
        data.investorToAccount,
        {
          decimal: data.amount,
        },
      ),
    ])
    .addSigner(account.keyset.guard.keys[0], (withCap) => [withCap(`coin.GAS`)])
    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
