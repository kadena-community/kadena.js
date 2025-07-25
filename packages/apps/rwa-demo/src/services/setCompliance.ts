import type { IAsset } from '@/contexts/AssetContext/AssetContext';
import type { IWalletAccount } from '@/providers/AccountProvider/AccountType';
import { getNetwork } from '@/utils/client';
import { env } from '@/utils/env';
import { getAsset } from '@/utils/getAsset';
import { getPubkeyFromAccount } from '@/utils/getPubKey';
import { Pact } from '@kadena/client';
import { AGENTROLES } from './addAgent';
import type { IComplianceRuleTypes } from './getComplianceRules';

export interface ISetComplianceProps {
  ruleKey: IComplianceRuleTypes;
  newState: boolean;
}

export const setCompliance = async (
  data: IComplianceRuleTypes[],
  account: IWalletAccount,
  asset: IAsset,
) => {
  const newData = data.map((item) => `${env.RWADEFAULT_NAMESPACE}.${item}`);

  return Pact.builder
    .execution(
      `
      (${getAsset(asset)}.set-compliance [${newData.toString()}])`,
    )

    .setMeta({
      senderAccount: account.address,
      chainId: getNetwork().chainId,
    })
    .addSigner(getPubkeyFromAccount(account), (withCap) => [
      withCap(`${getAsset(asset)}.ONLY-AGENT`, AGENTROLES.OWNER),
      withCap(`coin.GAS`),
    ])

    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
