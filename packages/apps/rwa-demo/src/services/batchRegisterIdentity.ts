import type { IWalletAccount } from '@/components/AccountProvider/AccountType';
import { getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { getPubkeyFromAccount } from '@/utils/getPubKey';
import { Pact } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';

export interface ICSVAccount {
  account: string;
  alias: string;
}

export interface IBatchRegisterIdentityProps {
  accounts: ICSVAccount[];
  agent: IWalletAccount;
}

const createPubKeyFromAccount = (account: string): string => {
  return account.replace('k:', '').replace('r:', '');
};

export const batchRegisterIdentity = async (
  data: IBatchRegisterIdentityProps,
) => {
  return Pact.builder
    .execution(
      `(${getAsset()}.batch-register-identity (read-msg 'investors) (read-msg 'investor-keysets) (read-msg 'agents) (read-msg 'countries))
      `,
    )
    .addData(
      'investor-keysets',
      data.accounts.map((account) => ({
        keys: [createPubKeyFromAccount(account.account)],
        pred: 'keys-all',
      })),
    )
    .addData(
      'investors',
      data.accounts.map((account) => account.account),
    )
    .addData('agent', data.agent.address)
    .addData(
      'agents',
      data.accounts.map(() => ''),
    )
    .addData(
      'countries',
      data.accounts.map(() => new PactNumber(0).toPactInteger() as never),
    )
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
