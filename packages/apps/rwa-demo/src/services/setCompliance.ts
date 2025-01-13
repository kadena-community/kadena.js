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
  data: ISetComplianceProps,
  account: IWalletAccount,
) => {
  return Pact.builder
    .execution(
      `
      (${getAsset()}.set-compliance (read-msg 'rules))`,
    )
    .addData('rules', [
      Pact.modules['RWA.compliance-v1'],
      Pact.modules[data.ruleKey],
    ])
    .addData('agent', account.address)
    .setMeta({
      senderAccount: account.address,
      chainId: getNetwork().chainId,
    })
    .addSigner(getPubkeyFromAccount(account), (withCap) => [
      withCap(`coin.GAS`),
    ])

    .setNetworkId(getNetwork().networkId)
    .createTransaction();
};
