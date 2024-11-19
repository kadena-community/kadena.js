import type { IWalletAccount } from '@/components/AccountProvider/utils';
import { getNetwork } from '@/utils/client';
import { Pact } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';

export interface IDistributeTokensProps {
  amount: number;
  investorAccount: string;
}

const createPubKeyFromAccount = (account: string): string => {
  return account.replace('k:', '').replace('r:', '');
};

export const distributeTokens = async (
  data: IDistributeTokensProps,
  account: IWalletAccount,
) => {
  console.log(new PactNumber(data.amount).toPrecision(2));
  return Pact.builder
    .execution(
      `
       (RWA.mvp-token.mint (read-string 'investor) ${new PactNumber(data.amount).toPactDecimal().decimal} (read-string 'agent))`,
    )
    .addData('agent', account.address)
    .addData('investor', data.investorAccount)
    .addData('investor-keyset', {
      keys: [createPubKeyFromAccount(data.investorAccount)],
      pred: 'keys-all',
    })
    .setMeta({
      senderAccount: account.address,
      chainId: getNetwork().chainId,
    })
    .addSigner(account.keyset.guard.keys[0], (withCap) => [
      withCap(`RWA.mvp-token.ONLY-AGENT`, account.address),
      withCap(
        `RWA.mvp-token.TRANSFER`,
        'c:soLScugf2M-6r5L-leMUCGvgddyB1qaKh9s7ka4upGU',
        data.investorAccount,

        { decimal: data.amount },
      ),
      withCap(`coin.GAS`),
    ])
    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
