import type { IWalletAccount } from '@/components/AccountProvider/utils';
import { getNetwork } from '@/utils/client';
import { Pact } from '@kadena/client';

export interface IRegisterIdentityProps {
  investor: string;
  agent: IWalletAccount;
}

const createPubKeyFromAccount = (account: string): string => {
  return account.replace('k:', '').replace('r:', '');
};

export const registerIdentity = async (data: IRegisterIdentityProps) => {
  return Pact.builder
    .execution(
      `(RWA.mvp-token.register-identity (read-string 'investor) (read-string 'agent) 1)
      (RWA.mvp-token.create-account (read-string 'investor) (read-keyset 'investor-keyset))
      `,
    )
    .addData('investor-keyset', {
      keys: [createPubKeyFromAccount(data.investor)],
      pred: 'keys-all',
    })
    .addData('investor', data.investor)
    .addData('agent', data.agent.address)
    .setMeta({
      senderAccount: data.agent.address,
      chainId: getNetwork().chainId,
    })
    .addSigner(data.agent.keyset.guard.keys[0], (withCap) => [
      withCap(`RWA.mvp-token.ONLY-AGENT`, 'whitelist-manager'),
      withCap(`coin.GAS`),
    ])

    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
