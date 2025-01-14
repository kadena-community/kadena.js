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
  /**
   * for the TRANSFER capability:
   * make sure that every account is only in the array 1 time and the amount is aggregated for a single account
   */

  const aggregatedAccounts = data.reduce(
    (acc: ITransferToken[], val: ITransferToken) => {
      //check if account is already in the new array

      let isNew = true;
      const newAcc = acc.map((r) => {
        if (r.to === val.to) {
          r.amount = `${parseInt(r.amount) + parseInt(val.amount)}`;
          isNew = false;
        }

        return r;
      });

      if (isNew) {
        newAcc.push(val);
      }

      return newAcc;
    },
    [],
  );

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
      aggregatedAccounts.map((_, idx) =>
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
