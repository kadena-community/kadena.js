import type { IWalletAccount } from '@/providers/AccountProvider/AccountType';
import { getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { getPubkeyFromAccount } from '@/utils/getPubKey';
import { Pact } from '@kadena/client';
import { PactNumber } from '@kadena/pactjs';
import { AGENTROLES } from './addAgent';
import { getKeysetService } from './getKeyset';

export interface ICSVAccount {
  account: string;
  alias: string;
}

export interface IBatchRegisterIdentityProps {
  accounts: ICSVAccount[];
  agent: IWalletAccount;
}

export const batchRegisterIdentity = async (
  data: IBatchRegisterIdentityProps,
) => {
  const promises = data.accounts.map((account) =>
    getKeysetService(account.account),
  );
  const keys = await Promise.all(promises);

  return Pact.builder
    .execution(
      `(${getAsset()}.batch-register-identity (read-msg 'investors) (read-msg 'investor-keysets) (read-msg 'agents) (read-msg 'countries))
      `,
    )
    .addData('investor-keysets', keys)
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
      withCap(`${getAsset()}.ONLY-AGENT`, AGENTROLES.OWNER),
      withCap(`${getAsset()}.ONLY-AGENT`, AGENTROLES.AGENTADMIN),
      withCap(`coin.GAS`),
    ])

    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
