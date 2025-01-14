import type { IWalletAccount } from '@/components/AccountProvider/AccountType';
import { getNetwork } from '@/utils/client';
import { getAsset } from '@/utils/getAsset';
import { getPubkeyFromAccount } from '@/utils/getPubKey';
import { Pact } from '@kadena/client';
import type { IComplianceRuleTypes } from './getComplianceRules';

export interface ISetComplianceProps {
  ruleKey: IComplianceRuleTypes;
  newState: boolean;
}

export const setCompliance = async (
  data: IComplianceRuleTypes[],
  account: IWalletAccount,
) => {
  console.log(data, `[${data.toString()}]`);
  return Pact.builder
    .execution(
      `
      (${getAsset()}.set-compliance [${data.toString()}])`,
    )

    .setMeta({
      senderAccount: account.address,
      chainId: getNetwork().chainId,
    })
    .addSigner(getPubkeyFromAccount(account), (withCap) => [
      withCap(`${getAsset()}.ONLY-OWNER`, ''),
      withCap(`coin.GAS`),
    ])

    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
