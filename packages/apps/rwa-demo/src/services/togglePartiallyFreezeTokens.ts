import type { IWalletAccount } from '@/components/AccountProvider/utils';
import { getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { getPubkeyFromAccount } from '@/utils/getPubKey';
import { Pact } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';

export interface ITogglePartiallyFreezeTokensProps {
  amount: string;
  investorAccount: string;
  freeze?: boolean;
}

const createPubKeyFromAccount = (account: string): string => {
  return account.replace('k:', '').replace('r:', '');
};

export const togglePartiallyFreezeTokens = async (
  data: ITogglePartiallyFreezeTokensProps,
  account: IWalletAccount,
) => {
  const func = data.freeze
    ? 'freeze-partial-tokens'
    : 'unfreeze-partial-tokens';

  return Pact.builder
    .execution(
      `
       (${getAsset()}.${func} (read-string 'investor) ${new PactNumber(data.amount).toDecimal()})`,
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
    .addSigner(getPubkeyFromAccount(account), (withCap) => [
      withCap(`${getAsset()}.ONLY-AGENT`, 'freezer'),
      withCap(`coin.GAS`),
    ])
    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
