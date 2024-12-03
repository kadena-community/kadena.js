import type { IWalletAccount } from '@/components/AccountProvider/utils';
import { getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { Pact } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';

export interface IPartiallyFreezeTokensProps {
  amount: number;
  investorAccount: string;
}

const createPubKeyFromAccount = (account: string): string => {
  return account.replace('k:', '').replace('r:', '');
};

export const partiallyFreezeTokens = async (
  data: IPartiallyFreezeTokensProps,
  account: IWalletAccount,
) => {
  return Pact.builder
    .execution(
      `
       (RWA.${getAsset()}.freeze-partial-tokens (read-string 'investor) ${new PactNumber(data.amount).toDecimal()})`,
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
      withCap(`RWA.${getAsset()}.ONLY-AGENT`, 'freezer'),
      withCap(`coin.GAS`),
    ])
    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
