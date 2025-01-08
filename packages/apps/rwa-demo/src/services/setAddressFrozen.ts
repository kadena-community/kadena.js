import type { IWalletAccount } from '@/components/AccountProvider/AccountType';
import { getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { getPubkeyFromAccount } from '@/utils/getPubKey';
import { Pact } from '@kadena/client';

export interface ISetAddressFrozenProps {
  investorAccount: string;
  pause: boolean;
  message?: string;
}

export const setAddressFrozen = async (
  data: ISetAddressFrozenProps,
  account: IWalletAccount,
) => {
  return Pact.builder
    .execution(
      `(${getAsset()}.set-address-frozen (read-string 'investor) ${data.pause})
      `,
    )
    .addData('investor', data.investorAccount)
    .addData('agent', account.address)
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
