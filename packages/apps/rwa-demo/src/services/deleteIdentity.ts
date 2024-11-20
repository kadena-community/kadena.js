import type { IWalletAccount } from '@/components/AccountProvider/utils';
import { getNetwork } from '@/utils/client';
import { Pact } from '@kadena/client';

export interface IDeleteIdentityProps {
  investor: string;
}

export const deleteIdentity = async (
  data: IDeleteIdentityProps,
  account: IWalletAccount,
) => {
  return Pact.builder
    .execution(`(RWA.mvp-token.delete-identity (read-string 'investor))`)
    .setMeta({
      senderAccount: account.address,
      chainId: getNetwork().chainId,
    })
    .addSigner(account.keyset.guard.keys[0], (withCap) => [
      withCap(`RWA.mvp-token.ONLY-AGENT`, 'whitelist-manager'),
      withCap(`coin.GAS`),
    ])
    .addData('investor', data.investor)
    .addData('agent', account.address)
    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
