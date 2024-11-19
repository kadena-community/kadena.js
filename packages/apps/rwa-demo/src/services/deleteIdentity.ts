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
    .execution(
      `(RWA.identity-registry.delete-identity (read-string 'investor) (read-string 'agent))`,
    )
    .setMeta({
      senderAccount: account.address,
      chainId: getNetwork().chainId,
    })
    .addSigner(account.keyset.guard.keys[0], (withCap) => [
      withCap(`RWA.agent-role.ONLY-AGENT`, account.address),
      withCap(`coin.GAS`),
    ])
    .addData('investor', data.investor)
    .addData('agent', account.address)
    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
