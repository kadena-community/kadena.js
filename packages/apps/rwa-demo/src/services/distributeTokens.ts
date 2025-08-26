import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import type { IWalletAccount } from '@/providers/AccountProvider/AccountType';
import { getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { getPubkeyFromAccount } from '@/utils/getPubKey';
import { Pact } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';
import { AGENTROLES } from './addAgent';

export interface IDistributeTokensProps {
  amount: string;
  investorAccount: string;
}

const createPubKeyFromAccount = (account: string): string => {
  return account.replace('k:', '').replace('r:', '');
};

export const distributeTokens = async (
  data: IDistributeTokensProps,
  account: IWalletAccount,
  asset: IAsset,
) => {
  return Pact.builder
    .execution(
      `
       (${getAsset(asset)}.mint (read-string 'investor) ${new PactNumber(data.amount).toDecimal()})`,
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
      withCap(`${getAsset(asset)}.ONLY-AGENT`, AGENTROLES.TRANSFERMANAGER),
      withCap(`${getAsset(asset)}.TRANSFER`, '', data.investorAccount, {
        decimal: data.amount,
      }),
      withCap(`coin.GAS`),
    ])
    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
