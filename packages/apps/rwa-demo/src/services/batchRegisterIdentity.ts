import type { IAsset } from '@/contexts/AssetContext/AssetContext';
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
  asset: IAsset,
) => {
  const promises = data.accounts.map((account) =>
    getKeysetService(account.account),
  );
  const keys = await Promise.all(promises);

  return Pact.builder
    .execution(
      `(${getAsset(asset)}.batch-register-identity (read-msg 'investor-addresses) (read-msg 'investor-guards) (read-msg 'identities) (read-msg 'countries))
      `,
    )
    .addData('investor-guards', keys)
    .addData(
      'investor-addresses',
      data.accounts.map((account) => account.account),
    )
    .addData('agent', data.agent.address)
    .addData(
      'identities',
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
      withCap(`${getAsset(asset)}.ONLY-AGENT`, AGENTROLES.OWNER),
      withCap(`${getAsset(asset)}.ONLY-AGENT`, AGENTROLES.AGENTADMIN),
      withCap(`coin.GAS`),
    ])

    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
