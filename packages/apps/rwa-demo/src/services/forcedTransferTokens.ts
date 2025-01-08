import type { IWalletAccount } from '@/components/AccountProvider/AccountType';
import { getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { getPubkeyFromAccount } from '@/utils/getPubKey';
import { Pact } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';
import type { ITransferTokensProps } from './transferTokens';

const createPubKeyFromAccount = (account: string): string => {
  return account.replace('k:', '').replace('r:', '');
};

export const forcedTransferTokens = async (
  data: ITransferTokensProps,
  account: IWalletAccount,
) => {
  return Pact.builder
    .execution(
      `
       (${getAsset()}.forced-transfer (read-string 'investorFrom) (read-string 'investorTo) ${new PactNumber(data.amount).toDecimal()})`,
    )
    .addData('agent', account.address)
    .addData('investorFrom', data.investorFromAccount)
    .addData('investorTo', data.investorToAccount)
    .setMeta({
      senderAccount: account.address,
      chainId: getNetwork().chainId,
    })
    .addSigner(createPubKeyFromAccount(account.address), (withCap) => [
      withCap(`${getAsset()}.ONLY-AGENT`, 'transfer-manager'),
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
