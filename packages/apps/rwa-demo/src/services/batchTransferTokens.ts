import type { IWalletAccount } from '@/components/AccountProvider/AccountType';
import { getNetwork } from '@/utils/client';
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

const createPubKeyFromAccount = (account: string): string => {
  return account.replace('k:', '').replace('r:', '');
};

export const batchTransferTokens = async (
  data: ITransferToken[],
  account: IWalletAccount,
) => {
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
    })
    .addSigner(createPubKeyFromAccount(account.address), (withCap) =>
      data.map((record, idx) =>
        withCap(`${getAsset()}.TRANSFER`, account.address, data[idx].to, {
          decimal: data[idx].amount.trim(),
        }),
      ),
    )
    .addSigner(getPubkeyFromAccount(account), (withCap) => [
      withCap(`coin.GAS`),
    ])
    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
