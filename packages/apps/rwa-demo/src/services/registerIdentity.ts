import type { IWalletAccount } from '@/components/AccountProvider/AccountType';
import { getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { getPubkeyFromAccount } from '@/utils/getPubKey';
import { Pact } from '@kadena/client';

export interface IRegisterIdentityProps {
  accountName: string;
  agent: IWalletAccount;
  alias: string;
  alreadyExists?: boolean;
}

const createPubKeyFromAccount = (account: string): string => {
  return account.replace('k:', '').replace('r:', '');
};

export const registerIdentity = async (data: IRegisterIdentityProps) => {
  return Pact.builder
    .execution(
      `(${getAsset()}.register-identity (read-string 'investor) (read-keyset 'investor-keyset) (read-string 'agent) 1)
      `,
    )
    .addData('investor-keyset', {
      keys: [createPubKeyFromAccount(data.accountName)],
      pred: 'keys-all',
    })
    .addData('investor', data.accountName)
    .addData('agent', data.agent.address)
    .setMeta({
      senderAccount: data.agent.address,
      chainId: getNetwork().chainId,
    })
    .addSigner(getPubkeyFromAccount(data.agent), (withCap) => [
      withCap(`${getAsset()}.ONLY-AGENT`, 'whitelist-manager'),
      withCap(`coin.GAS`),
    ])

    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
