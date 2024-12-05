import type { IWalletAccount } from '@/components/AccountProvider/utils';
import { getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { Pact } from '@kadena/client';

export interface ISetAddressFrozenProps {
  investorAccount: string;
  pause: boolean;
}

export const setAddressFrozen = async (
  data: ISetAddressFrozenProps,
  account: IWalletAccount,
) => {
  return Pact.builder
    .execution(
      `(RWA.${getAsset()}.set-address-frozen (read-string 'investor) ${data.pause})
      `,
    )
    .addData('investor', data.investorAccount)
    .addData('agent', account.address)
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
