import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import type { IWalletAccount } from '@/providers/AccountProvider/AccountType';
import { getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { getPubkeyFromAccount } from '@/utils/getPubKey';
import { Pact } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';
import { AGENTROLES } from './addAgent';

export interface IForcedTransferTokensProps {
  amount: number;
  investorFromAccount?: string;
  investorToAccount: string;
  isForced?: boolean;
}

export const forcedTransferTokens = async (
  data: IForcedTransferTokensProps,
  account: IWalletAccount,
  asset: IAsset,
) => {
  return Pact.builder
    .execution(
      `
       (${getAsset(asset)}.forced-transfer (read-string 'investorFrom) (read-string 'investorTo) ${new PactNumber(data.amount).toDecimal()})`,
    )
    .addData('agent', account.address)
    .addData('investorFrom', data.investorFromAccount!)
    .addData('investorTo', data.investorToAccount)
    .setMeta({
      senderAccount: account.address,
      chainId: getNetwork().chainId,
    })
    .addSigner(getPubkeyFromAccount(account), (withCap) => [
      withCap(`${getAsset(asset)}.ONLY-AGENT`, AGENTROLES.TRANSFERMANAGER),
      withCap(
        `${getAsset(asset)}.TRANSFER`,
        data.investorFromAccount,
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
